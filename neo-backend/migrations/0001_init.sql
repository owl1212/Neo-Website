CREATE TABLE reseller_applications (
  id            SERIAL PRIMARY KEY,
  company_name  VARCHAR(150) NOT NULL,
  contact_name  VARCHAR(150) NOT NULL,
  email         VARCHAR(150) NOT NULL,
  phone         VARCHAR(30),
  province      VARCHAR(50),
  message       TEXT,
  status        VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE contact_submissions (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(150) NOT NULL,
  phone        VARCHAR(30),
  type         VARCHAR(20) NOT NULL,
  message      TEXT NOT NULL,
  status       VARCHAR(20) NOT NULL DEFAULT 'new',
  created_at   TIMESTAMPTZ DEFAULT now()
);
