CREATE TABLE "channel" (
  id SERIAL PRIMARY KEY,
  yt_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL UNIQUE,
  thumbnail TEXT,
  rating_total INTEGER DEFAULT NULL,
  rating_count INTEGER DEFAULT NULL
);