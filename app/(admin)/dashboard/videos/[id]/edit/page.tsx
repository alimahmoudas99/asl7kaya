'use client';

import { useEffect, useState, use } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { videoSchema, type VideoFormData } from '@/lib/validators';
import { supabase } from '@/lib/supabaseClient';
import type { Category } from '@/lib/types';
import TagInput from '@/components/TagInput';
import ImageUpload from '@/components/ImageUpload';

export default function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [initialPeople, setInitialPeople] = useState<string[]>([]);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<VideoFormData>({
        resolver: zodResolver(videoSchema),
    });

    const thumbnailValue = watch('thumbnail_url');

    useEffect(() => {
        // Fetch categories and video data
        Promise.all([
            supabase.from('categories').select('*'),
            supabase.from('videos').select('*').eq('id', id).single()
        ]).then(([{ data: cats }, { data: video }]) => {
            if (cats) setCategories(cats);
            if (video) {
                reset(video);
                if (video.people_involved && Array.isArray(video.people_involved)) {
                    setInitialPeople(video.people_involved);
                    setValue('people_involved', video.people_involved);
                }
            }
        });
    }, [id, reset, setValue]);

    const onSubmit = async (data: VideoFormData) => {
        const payload = {
            ...data,
            people_involved: Array.isArray(data.people_involved) ? data.people_involved : [],
            thumbnail_url: data.thumbnail_url || null,
        };

        const { error } = await supabase.from('videos').update(payload).eq('id', id);

        if (error) {
            if (error.code === '23505') {
                alert('هذا الرابط (Slug) مستخدم بالفعل، يرجى تغييره.');
            } else {
                alert('حدث خطأ أثناء تحديث الفيديو: ' + error.message);
            }
            return;
        }

        await fetch('/api/revalidate?path=/');
        if (data.slug) await fetch(`/api/revalidate?path=/videos/${data.slug}`);

        router.push('/dashboard/videos');
    };

    return (
        <div className="dashboard__form">
            <div className="dashboard__page-header">
                <h1 className="dashboard__page-header-title">تعديل القصة</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="dashboard__form-card">
                {/* Title */}
                <div>
                    <label className="dashboard__form-label">عنوان القصة</label>
                    <input {...register('title')} className="dashboard__form-input" />
                    {errors.title && <p className="dashboard__form-error">{errors.title.message}</p>}
                </div>

                {/* Slug */}
                <div>
                    <label className="dashboard__form-label">الرابط (Slug)</label>
                    <input {...register('slug')} className="dashboard__form-input" dir="ltr" />
                    {errors.slug && <p className="dashboard__form-error">{errors.slug.message}</p>}
                </div>

                {/* YouTube ID */}
                <div>
                    <label className="dashboard__form-label">معرف فيديو يوتيوب</label>
                    <input {...register('youtube_id')} className="dashboard__form-input" dir="ltr" />
                    {errors.youtube_id && <p className="dashboard__form-error">{errors.youtube_id.message}</p>}
                </div>

                {/* Category */}
                <div>
                    <label className="dashboard__form-label">التصنيف</label>
                    <select {...register('category_id')} className="dashboard__form-select">
                        <option value="">اختر تصنيف...</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <p className="dashboard__form-error">{errors.category_id.message}</p>}
                </div>

                {/* Excerpt */}
                <div>
                    <label className="dashboard__form-label">مقتطف قصير</label>
                    <textarea {...register('excerpt')} className="dashboard__form-textarea" rows={3} />
                    {errors.excerpt && <p className="dashboard__form-error">{errors.excerpt.message}</p>}
                </div>

                {/* Content */}
                <div>
                    <label className="dashboard__form-label">محتوى المقال (HTML)</label>
                    <textarea {...register('content')} className="dashboard__form-textarea" rows={10} dir="ltr" />
                    {errors.content && <p className="dashboard__form-error">{errors.content.message}</p>}
                </div>

                {/* Thumbnail URL (Upload) */}
                <div>
                    <label className="dashboard__form-label">صورة مصغرة (اختياري)</label>
                    <ImageUpload
                        value={thumbnailValue || undefined}
                        onChange={(url) => setValue('thumbnail_url', url, { shouldValidate: true })}
                    />
                    <input type="hidden" {...register('thumbnail_url')} />
                    {errors.thumbnail_url && <p className="dashboard__form-error">{errors.thumbnail_url.message}</p>}
                </div>

                {/* Location */}
                <div>
                    <label className="dashboard__form-label">مكان الحدث (اختياري)</label>
                    <input {...register('location')} className="dashboard__form-input" />
                </div>

                {/* People Involved (Tag Input) */}
                <div>
                    <label className="dashboard__form-label">شخصيات القصة</label>
                    {initialPeople !== undefined && (
                        <TagInput
                            initialTags={initialPeople}
                            onChange={(tags) => setValue('people_involved', tags)}
                            placeholder="اكتب اسم الشخصية واضغط Enter"
                        />
                    )}
                </div>

                <div className="dashboard__form-actions">
                    <button type="submit" disabled={isSubmitting} className="dashboard__form-submit">
                        {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                    <button type="button" onClick={() => router.back()} className="dashboard__form-cancel">
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    );
}
