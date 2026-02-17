-- Migration: Add is_best column to videos table
ALTER TABLE videos ADD COLUMN is_best BOOLEAN DEFAULT FALSE;

-- Optional: Index for better performance
CREATE INDEX idx_videos_is_best ON videos(is_best) WHERE is_best = TRUE;
