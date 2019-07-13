ALTER TABLE "channel" 
  DROP COLUMN IF EXISTS total_videos,
  DROP COLUMN IF EXISTS comment_count,
  DROP COLUMN IF EXISTS view_count,
  DROP COLUMN IF EXISTS subscriber_count,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS date_updated;