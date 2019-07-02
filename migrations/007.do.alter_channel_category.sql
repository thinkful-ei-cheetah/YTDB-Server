ALTER TABLE "channel"
  ADD COLUMN
    category INTEGER REFERENCES category(id);