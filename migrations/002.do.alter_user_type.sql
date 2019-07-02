CREATE TYPE user_type AS ENUM (
  'admin',
  'normal'
);

ALTER TABLE "user"
  ADD COLUMN
    type user_type;