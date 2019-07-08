CREATE TABLE "channel_topic" (
  channel_id INTEGER REFERENCES channel(id) ON DELETE CASCADE NOT NULL,
  topic_id INTEGER REFERENCES topic(id) ON DELETE CASCADE NOT NULL,
  CONSTRAINT channel_topic_key PRIMARY KEY (channel_id, topic_id)
);