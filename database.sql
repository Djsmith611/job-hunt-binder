-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE
    "user" (
        "id" SERIAL PRIMARY KEY,
        "f_name" VARCHAR(50) NOT NULL,
        "l_name" VARCHAR(50),
        "email" VARCHAR(1000) UNIQUE NOT NULL,
        "password" VARCHAR(1000) NOT NULL,
        "s3_dir" VARCHAR,
        "date_created" DATE DEFAULT (CURRENT_DATE),
        "app_count" INT DEFAULT 0
    );

CREATE TABLE
    "leads" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER REFERENCES "user" ("id"),
        "status_id" INTEGER REFERENCES "status" ("id"),
        "app_date" DATE DEFAULT NULL,
        "title_id" INTEGER REFERENCES "title" ("id"),
        "field_id" INTEGER REFERENCES "field" ("id"),
        "company_id" INTEGER REFERENCES "company" ("id"),
        "location_id" INTEGER REFERENCES "location" ("id"),
        "type_id" INTEGER REFERENCES "type" ("id"),
        "notes" VARCHAR(5000),
        "description" VARCHAR(10000),
        "is_favorite" BOOLEAN
    );

CREATE TABLE
    "documents" (
        "id" SERIAL PRIMARY KEY,
        "s3_url" VARCHAR(1000),
        "lead_id" INTEGER REFERENCES "leads" ("id")
    );

CREATE TABLE
    "status" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(500));

CREATE TABLE
    "title" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(500));

CREATE TABLE
    "field" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(500));

CREATE TABLE
    "company" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(500));

CREATE TABLE
    "location" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(500));

CREATE TABLE
    "type" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(500));

INSERT INTO
    "status" ("name")
VALUES
    ('Applied'),
    ('None'),
    ('Interviewing'),
    ('Offered'),
    ('Signed'),
    ('Rejected'),
    ('No Response');

INSERT INTO
    "type" ("name")
VALUES
    ('On-Site'),
    ('Hybrid'),
    ('Remote');

CREATE OR REPLACE FUNCTION update_app_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE "user"
    SET "app_count" = (
      SELECT COUNT(*)
      FROM "leads"
      WHERE "status_id" = 2 AND "user_id" = OLD."user_id"
    )
    WHERE "id" = OLD."user_id";
  ELSE
    UPDATE "user"
    SET "app_count" = (
      SELECT COUNT(*)
      FROM "leads"
      WHERE "status_id" = 2 AND "user_id" = NEW."user_id"
    )
    WHERE "id" = NEW."user_id";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_app_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON "leads"
FOR EACH ROW
EXECUTE FUNCTION update_app_count();