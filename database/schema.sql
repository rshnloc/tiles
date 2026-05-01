-- ============================================================
-- insurance Insurance Platform — MySQL Schema
-- Version: 1.0.0
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

CREATE DATABASE IF NOT EXISTS tiles_insurance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tiles_insurance;

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  phone        VARCHAR(15)  NOT NULL UNIQUE,
  name         VARCHAR(120) DEFAULT NULL,
  email        VARCHAR(180) DEFAULT NULL UNIQUE,
  role         ENUM('customer','agent','admin') NOT NULL DEFAULT 'customer',
  avatar       VARCHAR(255) DEFAULT NULL,
  date_of_birth DATE        DEFAULT NULL,
  gender       ENUM('male','female','other') DEFAULT NULL,
  kyc_status   ENUM('not_submitted','pending','approved','rejected') NOT NULL DEFAULT 'not_submitted',
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone (phone),
  INDEX idx_role  (role),
  INDEX idx_kyc   (kyc_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- OTP SESSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS otp_sessions (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  phone      VARCHAR(15)  NOT NULL,
  otp        CHAR(6)      NOT NULL,
  expires_at DATETIME     NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_phone (phone),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- KYC DOCUMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS user_kyc (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED NOT NULL,
  doc_type      ENUM('pan','aadhaar','driving_license','irdai_license','passport') NOT NULL,
  file_path     VARCHAR(512) NOT NULL,
  status        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  reviewer_note TEXT         DEFAULT NULL,
  reviewed_at   DATETIME     DEFAULT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_doc (user_id, doc_type),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- INSURERS
-- ============================================================

CREATE TABLE IF NOT EXISTS insurers (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)  NOT NULL,
  logo          VARCHAR(255)  DEFAULT NULL,
  claim_ratio   DECIMAL(5,2)  DEFAULT 0.00,
  rating        DECIMAL(3,1)  DEFAULT 0.0,
  website       VARCHAR(255)  DEFAULT NULL,
  support_phone VARCHAR(20)   DEFAULT NULL,
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- INSURANCE PLANS
-- ============================================================

CREATE TABLE IF NOT EXISTS insurance_plans (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  insurer_id        INT UNSIGNED NOT NULL,
  name              VARCHAR(150) NOT NULL,
  category          ENUM('car','bike','health','life') NOT NULL,
  base_premium      DECIMAL(10,2) NOT NULL,
  sum_insured       DECIMAL(12,2) DEFAULT NULL,
  coverage_details  JSON         DEFAULT NULL,
  features          JSON         DEFAULT NULL,
  is_recommended    TINYINT(1)   NOT NULL DEFAULT 0,
  is_active         TINYINT(1)   NOT NULL DEFAULT 1,
  rating            DECIMAL(3,1) DEFAULT 0.0,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (insurer_id) REFERENCES insurers(id),
  INDEX idx_category (category),
  INDEX idx_premium  (base_premium)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- PLAN ADD-ONS
-- ============================================================

CREATE TABLE IF NOT EXISTS plan_addons (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plan_id     INT UNSIGNED NOT NULL,
  name        VARCHAR(120) NOT NULL,
  description TEXT         DEFAULT NULL,
  price       DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (plan_id) REFERENCES insurance_plans(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- AGENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS agents (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL UNIQUE,
  irdai_code      VARCHAR(50)  DEFAULT NULL,
  license_number  VARCHAR(80)  DEFAULT NULL,
  license_expiry  DATE         DEFAULT NULL,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  status          ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  rating          DECIMAL(3,1) DEFAULT 0.0,
  city            VARCHAR(80)  DEFAULT NULL,
  state           VARCHAR(80)  DEFAULT NULL,
  joined_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- POLICIES
-- ============================================================

CREATE TABLE IF NOT EXISTS policies (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  policy_number    VARCHAR(30)   NOT NULL UNIQUE,
  user_id          INT UNSIGNED  NOT NULL,
  agent_id         INT UNSIGNED  DEFAULT NULL,
  plan_id          INT UNSIGNED  NOT NULL,
  holder_details   JSON          NOT NULL,
  vehicle_details  JSON          DEFAULT NULL,
  addons           JSON          DEFAULT NULL,
  premium_paid     DECIMAL(10,2) NOT NULL,
  start_date       DATE          NOT NULL,
  end_date         DATE          NOT NULL,
  status           ENUM('active','expired','cancelled','lapsed') NOT NULL DEFAULT 'active',
  payment_id       VARCHAR(100)  DEFAULT NULL,
  pdf_path         VARCHAR(255)  DEFAULT NULL,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME      DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users(id),
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL,
  FOREIGN KEY (plan_id)  REFERENCES insurance_plans(id),
  INDEX idx_user   (user_id),
  INDEX idx_status (status),
  INDEX idx_end    (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- CLAIMS
-- ============================================================

CREATE TABLE IF NOT EXISTS claims (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  claim_number    VARCHAR(30)   NOT NULL UNIQUE,
  policy_id       INT UNSIGNED  NOT NULL,
  type            VARCHAR(50)   NOT NULL DEFAULT 'accident',
  incident_date   DATE          NOT NULL,
  description     TEXT          NOT NULL,
  amount_claimed  DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  amount_approved DECIMAL(12,2) DEFAULT NULL,
  status          ENUM('submitted','under_review','approved','rejected','paid') NOT NULL DEFAULT 'submitted',
  rejection_reason TEXT         DEFAULT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (policy_id) REFERENCES policies(id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- CLAIM DOCUMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS claim_documents (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  claim_id   INT UNSIGNED NOT NULL,
  doc_type   VARCHAR(80)  NOT NULL,
  file_path  VARCHAR(512) NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- CLAIM TIMELINE
-- ============================================================

CREATE TABLE IF NOT EXISTS claim_timeline (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  claim_id   INT UNSIGNED NOT NULL,
  status     VARCHAR(50)  NOT NULL,
  note       TEXT         DEFAULT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- LEADS (Agent CRM)
-- ============================================================

CREATE TABLE IF NOT EXISTS leads (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  agent_id       INT UNSIGNED NOT NULL,
  name           VARCHAR(120) NOT NULL,
  phone          VARCHAR(15)  NOT NULL,
  email          VARCHAR(180) DEFAULT NULL,
  insurance_type ENUM('car','bike','health','life') NOT NULL DEFAULT 'car',
  source         VARCHAR(50)  DEFAULT 'manual',
  status         ENUM('new','contacted','quoted','converted','lost') NOT NULL DEFAULT 'new',
  notes          TEXT         DEFAULT NULL,
  next_followup  DATETIME     DEFAULT NULL,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
  INDEX idx_agent  (agent_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- QUOTES
-- ============================================================

CREATE TABLE IF NOT EXISTS quotes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  agent_id    INT UNSIGNED  NOT NULL,
  lead_id     INT UNSIGNED  DEFAULT NULL,
  plan_id     INT UNSIGNED  NOT NULL,
  premium     DECIMAL(10,2) NOT NULL,
  details     JSON          DEFAULT NULL,
  status      ENUM('draft','sent','accepted','expired') NOT NULL DEFAULT 'draft',
  valid_until DATETIME      DEFAULT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id),
  FOREIGN KEY (lead_id)  REFERENCES leads(id) ON DELETE SET NULL,
  FOREIGN KEY (plan_id)  REFERENCES insurance_plans(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- COMMISSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS commissions (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  agent_id   INT UNSIGNED  NOT NULL,
  policy_id  INT UNSIGNED  NOT NULL,
  amount     DECIMAL(10,2) NOT NULL,
  rate       DECIMAL(5,2)  NOT NULL,
  status     ENUM('pending','processing','paid') NOT NULL DEFAULT 'pending',
  payout_date DATE         DEFAULT NULL,
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id)  REFERENCES agents(id),
  FOREIGN KEY (policy_id) REFERENCES policies(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS payments (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        INT UNSIGNED  NOT NULL,
  policy_id      INT UNSIGNED  NOT NULL,
  amount         DECIMAL(10,2) NOT NULL,
  gateway        VARCHAR(50)   DEFAULT 'razorpay',
  gateway_order  VARCHAR(100)  DEFAULT NULL,
  gateway_payment VARCHAR(100) DEFAULT NULL,
  method         ENUM('upi','card','netbanking','emi','wallet') DEFAULT NULL,
  status         ENUM('pending','success','failed','refunded') NOT NULL DEFAULT 'pending',
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME      DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)   REFERENCES users(id),
  FOREIGN KEY (policy_id) REFERENCES policies(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  title      VARCHAR(200) NOT NULL,
  message    TEXT         NOT NULL,
  type       VARCHAR(50)  DEFAULT 'info',
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  link       VARCHAR(255) DEFAULT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- BLOG POSTS
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) NOT NULL UNIQUE,
  excerpt      TEXT         DEFAULT NULL,
  content      LONGTEXT     NOT NULL,
  cover_image  VARCHAR(255) DEFAULT NULL,
  category     VARCHAR(80)  DEFAULT NULL,
  tags         JSON         DEFAULT NULL,
  author_id    INT UNSIGNED NOT NULL,
  is_published TINYINT(1)   NOT NULL DEFAULT 0,
  published_at DATETIME     DEFAULT NULL,
  views        INT UNSIGNED NOT NULL DEFAULT 0,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id),
  INDEX idx_slug      (slug),
  INDEX idx_published (is_published, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED DEFAULT NULL,
  action     VARCHAR(100) NOT NULL,
  entity     VARCHAR(80)  DEFAULT NULL,
  entity_id  INT UNSIGNED DEFAULT NULL,
  meta       JSON         DEFAULT NULL,
  ip         VARCHAR(45)  DEFAULT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_action (action),
  INDEX idx_entity (entity, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO insurers (name, logo, claim_ratio, rating, support_phone) VALUES
('HDFC Ergo',       '/insurers/hdfc.png',   98.0, 4.5, '1800-2700-700'),
('ICICI Lombard',   '/insurers/icici.png',  97.5, 4.4, '1800-2666'),
('Bajaj Allianz',   '/insurers/bajaj.png',  95.2, 4.3, '1800-209-5858'),
('New India Assurance', '/insurers/nia.png', 96.0, 4.2, '1800-209-1415'),
('Star Health',     '/insurers/star.png',   94.8, 4.3, '1800-425-2255'),
('LIC',             '/insurers/lic.png',    99.1, 4.6, '1800-227-717');

INSERT INTO users (phone, name, email, role, kyc_status) VALUES
('9999999999', 'Admin User', 'admin@insurance.in', 'admin', 'approved');

SET FOREIGN_KEY_CHECKS = 1;
