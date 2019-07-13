ALTER TABLE "channel"
  ADD COLUMN total_videos bigint,
  ADD COLUMN comment_count bigint,
  ADD COLUMN view_count bigint,
  ADD COLUMN subscriber_count bigint,
  ADD COLUMN description VARCHAR,
  ADD COLUMN date_updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL;