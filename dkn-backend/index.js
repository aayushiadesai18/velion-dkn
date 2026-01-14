const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();


const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());

app.post("/knowledge", requireUser, (req, res) => {
  const u = req.user; 

  const { title, content, tags } = req.body;

  if (u.role !== "CONSULTANT" && u.role !== "KNOWLEDGE_CHAMPION") {
    return res
      .status(403)
      .json({ message: "Only consultants or champions can upload knowledge items" });
  }

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  db.run(
    `INSERT INTO knowledge_items (title, content, owner_user_id, status, tags)
     VALUES (?,?,?,?,?)`,
    [title, content, u.id, "PENDING_REVIEW", tags || null],
    function (err) {
      if (err) {
        console.error("DB error in POST /knowledge", err);
        return res.status(500).json({ message: "Server error" });
      }
      const newId = this.lastID;
      audit(u.id, "UPLOAD_KNOWLEDGE_ITEM", `id=${newId}`);
      res.status(201).json({ id: newId });
    }
  );
});


const db = new sqlite3.Database('./dkn.db', (err) => {
  if (err) {
    console.error('Failed to connect to SQLite', err);
  } else {
    console.log('Connected to SQLite dkn.db');
  }
});


function audit(userId, action, details) {
  db.run(
    'INSERT INTO audit_logs (user_id, action, details) VALUES (?,?,?)',
    [userId || null, action, details || null],
    (err) => {
      if (err) {
        console.error('Failed to write audit log', err);
      }
    }
  );
}


app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.get(
    'SELECT id, name, email, role, password FROM users WHERE email = ?',
    [email],
    (err, user) => {
      if (err) {
        console.error('DB error', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (!user || user.password !== password) {
        
        audit(null, 'LOGIN_FAILED', `email=${email}`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // success
      audit(user.id, 'LOGIN_SUCCESS', `role=${user.role}`);
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    }
  );
});


function requireUser(req, res, next) {
  const userId = req.header('x-user-id');
  if (!userId) {
    return res.status(401).json({ message: 'Missing x-user-id header' });
  }
  db.get(
    'SELECT id, name, email, role FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (!user) return res.status(401).json({ message: 'User not found' });
      req.user = user;
      next();
    }
  );
}

app.post("/qa", requireUser, (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ message: "Question is required" });
  }

  db.run(
    `INSERT INTO qa_requests (question, employee_id, status)
     VALUES (?, ?, 'OPEN')`,
    [question, req.user.id],
    function (err) {
      if (err) {
        console.error("DB error inserting QA", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.put("/qa/:id/answer", (req, res) => {
  const { answer } = req.body;
  const { id } = req.params;

  db.run(
    `UPDATE qa_requests
     SET answer = ?, status = 'ANSWERED', updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [answer, id],
    function (err) {
      if (err) return res.status(500).json({ message: "Server error" });
      if (this.changes === 0) {
        return res.status(404).json({ message: "QA request not found" });
      }
      res.json({ message: "Answer saved" });
    }
  );
});

app.get("/qa", (req, res) => {
  db.all(
    `SELECT id, question, employee_id, champion_id, answer, status, created_at
     FROM qa_requests
     ORDER BY created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error("DB error fetching QA", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.json(rows);
    }
  );
});




app.get('/onboarding', requireUser, (req, res) => {
  const u = req.user;

  db.all(
    `
    SELECT oi.id,
           oi.title,
           oi.description,
           COALESCE(op.completed, 0) AS completed,
           op.completed_at
    FROM onboarding_items oi
    LEFT JOIN onboarding_progress op
      ON op.item_id = oi.id AND op.user_id = ?
    ORDER BY oi.id
    `,
    [u.id],
    (err, rows) => {
      if (err) {
        console.error('DB error', err);
        return res.status(500).json({ message: 'Server error' });
      }
      audit(u.id, 'VIEW_ONBOARDING', null);
      res.json(rows);
    }
  );
});


app.post('/onboarding/complete', requireUser, (req, res) => {
  const u = req.user;
  const { itemId } = req.body;

  if (!itemId) {
    return res.status(400).json({ message: 'itemId is required' });
  }

  const now = new Date().toISOString();

  db.run(
    `
    INSERT INTO onboarding_progress (user_id, item_id, completed, completed_at)
    VALUES (?,?,1,?)
    ON CONFLICT(user_id, item_id)
    DO UPDATE SET completed = 1, completed_at = excluded.completed_at
    `,
    [u.id, itemId, now],
    function (err) {
      if (err) {
        console.error('DB error', err);
        return res.status(500).json({ message: 'Server error' });
      }
      audit(u.id, 'COMPLETE_ONBOARDING_ITEM', `itemId=${itemId}`);
      res.json({ success: true });
    }
  );
});


app.get("/knowledge", requireUser, (req, res) => {
  const u = req.user;
  const q = (req.query.q || req.query.query || "").trim();

  let sql = `
    SELECT id, title, content, owner_user_id, status, tags, created_at
    FROM knowledge_items
    WHERE status = 'APPROVED'
  `;
  const params = [];

  if (q) {
    sql += " AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  sql += " ORDER BY created_at DESC";

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("DB error searching knowledge_items", err);
      return res.status(500).json({ message: "Server error" });
    }
    audit(u.id, "SEARCH_KNOWLEDGE", q || "(no query)");
    res.json(rows);
  });
});
app.post("/bookmarks", requireUser, (req, res) => {
  const userId = req.user.id;
  const { knowledge_item_id } = req.body;

  if (!knowledge_item_id) {
    return res.status(400).json({ message: "knowledge_item_id is required" });
  }

  db.run(
    `INSERT OR IGNORE INTO bookmarks (user_id, knowledge_item_id)
     VALUES (?, ?)`,
    [userId, knowledge_item_id],
    function (err) {
      if (err) {
        console.error("Error inserting bookmark", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.status(201).json({ message: "Bookmarked" });
    }
  );
});



app.post("/knowledge", requireUser, (req, res) => {
  const u = req.user;                
  const { title, content, tags } = req.body;

  if (u.role !== "CONSULTANT" && u.role !== "KNOWLEDGE_CHAMPION") {
    return res
      .status(403)
      .json({ message: "Only consultants or champions can upload knowledge items" });
  }

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  db.run(
    `INSERT INTO knowledge_items (title, content, owner_user_id, status, tags)
     VALUES (?,?,?,?,?)`,
    [title, content, u.id, "PENDING_REVIEW", tags || null],
    function (err) {
      if (err) {
        console.error("DB error", err);
        return res.status(500).json({ message: "Server error" });
      }
      const newId = this.lastID;
      audit(u.id, "UPLOAD_KNOWLEDGE_ITEM", `id=${newId}`);
      res.status(201).json({ id: newId });
    }
  );
});


app.get('/knowledge/pending', requireUser, (req, res) => {
  const u = req.user;
  if (u.role !== 'KNOWLEDGE_CHAMPION') {
    return res.status(403).json({ message: 'Only Knowledge Champions can view pending items' });
  }

  db.all(
    `
    SELECT ki.id, ki.title, ki.content, ki.owner_user_id, ki.status, ki.tags, ki.created_at,
           u.name AS owner_name
    FROM knowledge_items ki
    JOIN users u ON u.id = ki.owner_user_id
    WHERE ki.status = 'PENDING_REVIEW'
    ORDER BY ki.created_at ASC
    `,
    [],
    (err, rows) => {
      if (err) {
        console.error('DB error', err);
        return res.status(500).json({ message: 'Server error' });
      }
      audit(u.id, 'VIEW_PENDING_KNOWLEDGE', null);
      res.json(rows);
    }
  );
});


app.post('/knowledge/:id/approve', requireUser, (req, res) => {
  const u = req.user;
  const id = req.params.id;

  if (u.role !== 'KNOWLEDGE_CHAMPION') {
    return res.status(403).json({ message: 'Only Knowledge Champions can approve items' });
  }

  db.run(
    `UPDATE knowledge_items SET status = 'APPROVED' WHERE id = ?`,
    [id],
    function (err) {
      if (err) {
        console.error('DB error', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Item not found' });
      }
      audit(u.id, 'APPROVE_KNOWLEDGE_ITEM', `id=${id}`);
      res.json({ success: true });
    }
  );
});


app.post('/knowledge/:id/reject', requireUser, (req, res) => {
  const u = req.user;
  const id = req.params.id;

  if (u.role !== 'KNOWLEDGE_CHAMPION') {
    return res.status(403).json({ message: 'Only Knowledge Champions can reject items' });
  }

  db.run(
    `UPDATE knowledge_items SET status = 'REJECTED' WHERE id = ?`,
    [id],
    function (err) {
      if (err) {
        console.error('DB error', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Item not found' });
      }
      audit(u.id, 'REJECT_KNOWLEDGE_ITEM', `id=${id}`);
      res.json({ success: true });
    }
  );
});


app.post('/qa', requireUser, (req, res) => {
  const u = req.user;
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: 'Question is required' });
  }

  db.run(
    `INSERT INTO qa_requests (question, employee_id, status)
     VALUES (?,?, 'OPEN')`,
    [question, u.id],
    function (err) {
      if (err) {
        console.error('DB error', err);
        return res.status(500).json({ message: 'Server error' });
      }
      const newId = this.lastID;
      audit(u.id, 'SUBMIT_QA_REQUEST', `id=${newId}`);
      res.status(201).json({ id: newId });
    }
  );
});

app.get('/qa/my', requireUser, (req, res) => {
  const u = req.user;

  db.all(
    `
    SELECT id, question, answer, status, created_at, updated_at
    FROM qa_requests
    WHERE employee_id = ?
    ORDER BY created_at DESC
    `,
    [u.id],
    (err, rows) => {
      if (err) {
        console.error('DB error', err);
        return res.status(500).json({ message: 'Server error' });
      }
      audit(u.id, 'VIEW_OWN_QA_REQUESTS', null);
      res.json(rows);
    }
  );
});


app.get('/qa/open', requireUser, (req, res) => {
  const u = req.user;

  if (u.role !== 'KNOWLEDGE_CHAMPION') {
    return res.status(403).json({ message: 'Only Knowledge Champions can view open QA requests' });
  }

  db.all(
    `
    SELECT qr.id, qr.question, qr.status, qr.created_at,
           e.name AS employee_name
    FROM qa_requests qr
    JOIN users e ON e.id = qr.employee_id
    WHERE qr.status = 'OPEN'
    ORDER BY qr.created_at ASC
    `,
    [],
    (err, rows) => {
      if (err) {
        console.error('DB error', err);
        return res.status(500).json({ message: 'Server error' });
      }
      audit(u.id, 'VIEW_OPEN_QA_REQUESTS', null);
      res.json(rows);
    }
  );
});



app.post('/qa/:id/answer', requireUser, (req, res) => {
  const u = req.user;
  const id = req.params.id;
  const { answer } = req.body;

  if (u.role !== 'KNOWLEDGE_CHAMPION') {
    return res.status(403).json({ message: 'Only Knowledge Champions can answer QA requests' });
  }

  if (!answer) {
    return res.status(400).json({ message: 'Answer is required' });
  }

  const now = new Date().toISOString();

  db.run(
    `
    UPDATE qa_requests
    SET answer = ?, status = 'ANSWERED', champion_id = ?, updated_at = ?
    WHERE id = ?
    `,
    [answer, u.id, now, id],
    function (err) {
      if (err) {
        console.error('DB error', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'QA request not found' });
      }
      audit(u.id, 'ANSWER_QA_REQUEST', 'id=' + id);
      res.json({ success: true });
    }
  );
});



app.get('/analytics', requireUser, (req, res) => {
  const u = req.user;

  if (u.role !== 'KNOWLEDGE_CHAMPION' && u.role !== 'EXECUTIVE') {
    return res
      .status(403)
      .json({ message: 'Only Knowledge Champions and Executives can view analytics' });
  }

  const result = {};

  db.get('SELECT COUNT(*) AS total_users FROM users', [], (err, row1) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    result.total_users = row1.total_users;

    db.get('SELECT COUNT(*) AS total_knowledge FROM knowledge_items', [], (err, row2) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      result.total_knowledge = row2.total_knowledge;

      db.get(
        "SELECT COUNT(*) AS pending_qa FROM qa_requests WHERE status = 'OPEN'",
        [],
        (err, row3) => {
          if (err) return res.status(500).json({ message: 'Server error' });
          result.pending_qa = row3.pending_qa;

          db.get(
            "SELECT COUNT(*) AS approved_items FROM knowledge_items WHERE status = 'APPROVED'",
            [],
            (err, row4) => {
              if (err) return res.status(500).json({ message: 'Server error' });
              result.approved_items = row4.approved_items;

              audit(u.id, 'VIEW_ANALYTICS', null);
              res.json(result);
            }
          );
        }
      );
    });
  });
});




app.get('/audit-logs', requireUser, (req, res) => {
  const u = req.user;

  if (
    u.role !== 'EXECUTIVE' &&
    u.role !== 'GOVERNANCE_COUNCIL' &&
    u.role !== 'SYSTEM_ADMIN'
  ) {
    return res
      .status(403)
      .json({ message: 'Not authorised to view audit logs' });
  }

  db.all(
    `
      SELECT al.id,
             al.user_id,
             u.name       AS user_name,
             al.action,
             al.details,
             al.created_at
      FROM audit_logs al
      LEFT JOIN users u ON u.id = al.user_id
      ORDER BY al.created_at DESC
      LIMIT 100
    `,
    [],
    (err, rows) => {
      if (err) {
        console.error('DB error', err);
        return res.status(500).json({ message: 'Server error' });
      }
    
      audit(u.id, 'VIEW_AUDIT_LOGS', null);
      res.json(rows);
    }
  );
});


app.get("/admin/users", (req, res) => {
  db.all(
    `
    SELECT id, name, email, role
    FROM users
    ORDER BY id
    `,
    [],
    (err, rows) => {
      if (err) {
        console.error("DB error", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.json(rows);
    }
  );
});


app.post('/admin/users/:id/role', requireUser, (req, res) => {
  const u = req.user;
  const targetId = req.params.id;
  const { role } = req.body;

  if (u.role !== 'SYSTEM_ADMIN') {
    return res.status(403).json({ message: 'Only System Admin can change roles' });
  }

  const allowedRoles = [
    'EMPLOYEE',
    'NEW_EMPLOYEE',
    'CONSULTANT',
    'KNOWLEDGE_CHAMPION',
    'EXECUTIVE',
    'GOVERNANCE_COUNCIL',
    'SYSTEM_ADMIN'
  ];

  if (!role || !allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  db.run(
    `UPDATE users SET role = ? WHERE id = ?`,
    [role, targetId],
    function (err) {
      if (err) {
        console.error('DB error', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      audit(u.id, 'CHANGE_USER_ROLE', 'userId=' + targetId + ',role=' + role);
      res.json({ success: true });
    }
  );
});


app.get('/', (req, res) => {
  res.json({ status: 'DKN backend running' });
});

app.listen(PORT, () => {
  console.log(`DKN backend listening on http://localhost:${PORT}`);
});
