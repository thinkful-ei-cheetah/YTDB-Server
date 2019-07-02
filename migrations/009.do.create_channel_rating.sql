CREATE TABLE "channel_rating" (
  "user_id" INTEGER REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
  "channel_id" INTEGER REFERENCES channel(id) ON DELETE CASCADE NOT NULL,
  CONSTRAINT channel_rating_key PRIMARY KEY ("user_id" , "channel_id"),
  rating INTEGER NOT NULL,
  CHECK (rating BETWEEN 0 AND 10)
);