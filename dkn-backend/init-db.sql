PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS onboarding_progress;
DROP TABLE IF EXISTS onboarding_items;
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS qa_requests;
DROP TABLE IF EXISTS knowledge_items;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN (
    'EMPLOYEE',
    'NEW_EMPLOYEE',
    'CONSULTANT',
    'KNOWLEDGE_CHAMPION',
    'EXECUTIVE',
    'GOVERNANCE_COUNCIL',
    'SYSTEM_ADMIN'
  ))
);

CREATE TABLE knowledge_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  owner_user_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('PENDING_REVIEW','APPROVED','REJECTED')),
  tags TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(owner_user_id) REFERENCES users(id)
);

CREATE TABLE qa_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  employee_id INTEGER NOT NULL,
  champion_id INTEGER,
  answer TEXT,
  status TEXT NOT NULL CHECK(status IN ('OPEN','NEEDS_INFO','ANSWERED')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT,
  FOREIGN KEY(employee_id) REFERENCES users(id),
  FOREIGN KEY(champion_id) REFERENCES users(id)
);

CREATE TABLE bookmarks (
  user_id INTEGER NOT NULL,
  knowledge_item_id INTEGER NOT NULL,
  PRIMARY KEY(user_id, knowledge_item_id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(knowledge_item_id) REFERENCES knowledge_items(id)
);

CREATE TABLE onboarding_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT
);

CREATE TABLE onboarding_progress (
  user_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  PRIMARY KEY(user_id, item_id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(item_id) REFERENCES onboarding_items(id)
);

CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  details TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO users (name, email, password, role) VALUES
  ('Stefan', 'stefan@velion.com', 'password', 'EMPLOYEE'),
  ('Elena', 'elena@velion.com', 'password', 'NEW_EMPLOYEE'),
  ('Caroline', 'caroline@velion.com', 'password', 'CONSULTANT'),
  ('Bonnie', 'bonnie@velion.com', 'password', 'KNOWLEDGE_CHAMPION'),
  ('Damon', 'damon@velion.com', 'password', 'EXECUTIVE'),
  ('Klaus', 'klaus@velion.com', 'password', 'GOVERNANCE_COUNCIL'),
  ('Katherine', 'katherine@velion.com', 'password', 'SYSTEM_ADMIN');

INSERT INTO onboarding_items (title, description) VALUES
  ('Welcome to DKN', 'Overview of the Digital Knowledge Network!'),
  ('Using search effectively', 'How to find knowledge items?'),
  ('Submitting QA requests', 'How to ask experts for help?');

INSERT INTO knowledge_items (title, content, owner_user_id, status, tags) VALUES
  ('DKN Overview', 'High level description of the Digital Knowledge Network.', 3, 'APPROVED', 'overview,intro'),
  ('Search Tips', 'How to use filters and tags to find knowledge?', 3, 'APPROVED', 'search,onboarding'),
  ('QA Process Guide', 'Steps for submitting and answering QA requests.', 3, 'APPROVED', 'qa,process');
