BEGIN;

DROP TABLE IF EXISTS "expenditure", "budget", "user";

CREATE TABLE "user" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "last_name" VARCHAR(255),
    "first_name" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "total_budget" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_expenses" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL default(NOW()),
    "updated_at" TIMESTAMPTZ NOT NULL default(NOW())
);


CREATE TABLE "budget" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "warning_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "spent_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "allocated_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "color" VARCHAR(255),
    "icon" MEDIUMTEXT,
    "user_id" INT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL default(NOW()),
    "updated_at" TIMESTAMPTZ NOT NULL default(NOW())
);


CREATE TABLE "expenditure" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "description" VARCHAR(255),
  "payment_method" VARCHAR(255),
  "amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "date" DATE,
  "user_id" INT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "budget_id" INT NOT NULL REFERENCES "budget"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL default(NOW()),
  "updated_at" TIMESTAMPTZ NOT NULL default(NOW())
);

COMMIT;