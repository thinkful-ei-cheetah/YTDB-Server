CREATE TABLE "channel" (
  id SERIAL PRIMARY KEY,
  yt_id TEXT NOT NULL UNIQUE,
  title VARCHAR NOT NULL,
  thumbnail TEXT,
  rating_total INTEGER DEFAULT 0,
  rating_count INTEGER DEFAULT 0
);