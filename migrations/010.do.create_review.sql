CREATE TABLE "review" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
  "channel_id" INTEGER REFERENCES channel(id) ON DELETE CASCADE NOT NULL,
  "text" TEXT NOT NULL,
  "total_likes" INTEGER,
  "total_dislikes" INTEGER,
  "date_created" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  "date_updated" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);