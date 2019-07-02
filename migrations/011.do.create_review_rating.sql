CREATE TABLE "review_rating" (
  "user_id" INTEGER REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
  "review_id" INTEGER REFERENCES "review"(id) ON DELETE CASCADE NOT NULL,
  CONSTRAINT review_rating_key PRIMARY KEY ("user_id", "review_id"),
  "like" BOOL NOT NULL
);