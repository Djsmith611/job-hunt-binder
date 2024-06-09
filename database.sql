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
    "status" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(500), "color" VARCHAR(500));

CREATE TABLE
    "title" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(500) NOT NULL);

CREATE TABLE
    "field" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(500) NOT NULL);

CREATE TABLE
    "company" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(500) NOT NULL);

CREATE TABLE
    "location" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(500) NOT NULL);

CREATE TABLE
    "type" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(500));

INSERT INTO
    "status" ("name", "color")
VALUES
    ('Ready to Apply', 'gray'),
    ('Applied', 'orange'),
    ('Interviewing', '#D8D511'),
    ('No Response', 'red'),
    ('TBD', 'purple'),
    ('Offered', 'green'),
    ('Signed', 'green'),
    ('Rejected', 'gray');

INSERT INTO
    "type" ("name")
VALUES
    ('On-Site'),
    ('Hybrid'),
    ('Remote');

INSERT INTO 
    "title" ("name") 
VALUES
    ('Software Engineer'),
    ('Data Scientist'),
    ('DevOps Engineer'),
    ('Product Manager'),
    ('UX Designer'),
    ('Full Stack Developer'),
    ('Machine Learning Engineer'),
    ('IT Support Specialist'),
    ('Cybersecurity Analyst'),
    ('Cloud Architect');

INSERT INTO 
    "field" ("name") 
VALUES
    ('Web Development'),
    ('Data Analysis'),
    ('Systems Engineering'),
    ('Product Management'),
    ('User Experience Design'),
    ('AI and Machine Learning'),
    ('IT Support'),
    ('Cybersecurity'),
    ('Cloud Computing'),
    ('Network Engineering');

INSERT INTO 
    "company" ("name") 
VALUES
    ('Google'),
    ('Microsoft'),
    ('Apple'),
    ('Amazon'),
    ('Facebook'),
    ('Netflix'),
    ('Twitter'),
    ('Salesforce'),
    ('LinkedIn'),
    ('Adobe');


INSERT INTO 
    "location" ("name") 
VALUES
    ('San Francisco, CA'),
    ('New York, NY'),
    ('Seattle, WA'),
    ('Austin, TX'),
    ('Boston, MA'),
    ('Chicago, IL'),
    ('Los Angeles, CA'),
    ('Denver, CO'),
    ('Washington, D.C.'),
    ('Atlanta, GA');

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
        "is_favorite" BOOLEAN,
    );

CREATE TABLE
    "documents" (
        "id" SERIAL PRIMARY KEY,
        "s3_url" VARCHAR(1000),
        "lead_id" INTEGER REFERENCES "leads" ("id")
    );
    
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