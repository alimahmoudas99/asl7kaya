-- 1. إضافة عمود المشاهدات لجدول الفيديوهات
ALTER TABLE videos ADD COLUMN views INTEGER DEFAULT 0;

-- 2. إنشاء وظيفة (Function) لزيادة المشاهدات بشكل تلقائي (Atomic)
-- هذه الوظيفة تضمن دقة العد حتى لو ضغط أكثر من زائر في نفس اللحظة
CREATE OR REPLACE FUNCTION increment_views(video_id UUID) 
RETURNS void AS $$ 
BEGIN 
  UPDATE videos 
  SET views = COALESCE(views, 0) + 1 
  WHERE id = video_id; 
END; 
$$ LANGUAGE plpgsql;
