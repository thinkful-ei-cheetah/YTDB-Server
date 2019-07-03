CREATE TABLE "channel_keyword" (
  channel_id INTEGER REFERENCES channel(id) ON DELETE CASCADE NOT NULL,
  keyword_id INTEGER REFERENCES keyword(id) ON DELETE CASCADE NOT NULL,
  CONSTRAINT channel_keyword_key PRIMARY KEY (channel_id, keyword_id)
);