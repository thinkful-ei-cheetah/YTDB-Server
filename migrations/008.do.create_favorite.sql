CREATE TABLE "favorite" (
  "user_id" INTEGER REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
  "channel_id" INTEGER REFERENCES channel(id) ON DELETE CASCADE NOT NULL,
  CONSTRAINT favorite_key PRIMARY KEY ("user_id" , "channel_id"),
  "date_created" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);