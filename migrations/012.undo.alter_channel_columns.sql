ALTER TABLE "channel" 
  DROP COLUMN IF EXISTS "total-videos",
  DROP COLUMN IF EXISTS "comment-count",
  DROP COLUMN IF EXISTS "view-count",
  DROP COLUMN IF EXISTS "subscriber-count",
  DROP COLUMN IF EXISTS "description",
  DROP COLUMN IF EXISTS "date_updated";