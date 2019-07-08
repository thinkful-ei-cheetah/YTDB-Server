ALTER TABLE "channel"
  ADD COLUMN "total-videos" INTEGER,
  ADD COLUMN "comment-count" INTEGER,
  ADD COLUMN "view-count" INTEGER,
  ADD COLUMN "subscriber-count" INTEGER,
  ADD COLUMN "description" TEXT,
  ADD COLUMN "date_updated" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL;