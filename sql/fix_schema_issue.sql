-- 1. التأكد من إضافة العمود (إذا لم يكن موجوداً)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='videos' AND column_name='is_best') THEN
        ALTER TABLE videos ADD COLUMN is_best BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 2. التأكد من وجود الـ Index (اختياري للسرعة)
CREATE INDEX IF NOT EXISTS idx_videos_is_best ON videos(is_best) WHERE is_best = TRUE;

-- 3. تصفير الكاش - مهم جداً
NOTIFY pgrst, 'reload schema';

-- 4. للتحقق: شغل هذا السطر بعد التنفيذ للتأكد من وجود العمود
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'videos';
