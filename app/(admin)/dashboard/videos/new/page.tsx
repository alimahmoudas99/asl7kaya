'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { videoSchema, type VideoFormData } from '@/lib/validators';
import { supabase } from '@/lib/supabaseClient';
import type { Category } from '@/lib/types';
import TagInput from '@/components/TagInput';
import ImageUpload from '@/components/ImageUpload';

export default function NewVideoPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);

    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<VideoFormData>({
        resolver: zodResolver(videoSchema),
        defaultValues: {
            people_involved: [],
            thumbnail_url: '',
        }
    });

    const thumbnailValue = watch('thumbnail_url');

    useEffect(() => {
        supabase.from('categories').select('*').then(({ data }) => {
            if (data) setCategories(data);
        });
    }, []);

    const onSubmit = async (data: VideoFormData) => {
        // Ensure people_involved is an array and thumbnail is present
        const payload = {
            ...data,
            people_involved: Array.isArray(data.people_involved) ? data.people_involved : [],
            thumbnail_url: data.thumbnail_url || null, // Convert empty string to null for clean DB entry
        };

        const { error } = await supabase.from('videos').insert([payload]);

        if (error) {
            if (error.code === '23505') {
                alert('هذا الرابط (Slug) مستخدم بالفعل، يرجى تغييره.');
            } else {
                alert('حدث خطأ أثناء حفظ الفيديو: ' + error.message);
            }
            return;
        }

        // Trigger revalidation
        await fetch('/api/revalidate?path=/');
        if (data.slug) await fetch(`/api/revalidate?path=/videos/${data.slug}`);

        router.push('/dashboard/videos');
    };

    return (
        <div className="dashboard__form">
            <div className="dashboard__page-header">
                <h1 className="dashboard__page-header-title">إضافة قصة جديدة</h1>
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
                    <p className="dashboard__form-hint">يجب أن يكون بالإنجليزية وبدون مسافات، مثال: crime-story-1</p>
                    {errors.slug && <p className="dashboard__form-error">{errors.slug.message}</p>}
                </div>

                {/* YouTube ID */}
                <div>
                    <label className="dashboard__form-label">معرف فيديو يوتيوب</label>
                    <input {...register('youtube_id')} className="dashboard__form-input" dir="ltr" placeholder="Ex: dQw4w9WgXcQ" />
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
                    <p className="dashboard__form-hint">يمكنك استخدام تنسيق HTML لكتابة المقال</p>
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
                    <TagInput
                        onChange={(tags) => setValue('people_involved', tags)}
                        initialTags={[]}
                        placeholder="اكتب اسم الشخصية واضغط Enter"
                    />
                </div>

                <div className="dashboard__form-actions">
                    <button type="submit" disabled={isSubmitting} className="dashboard__form-submit">
                        {isSubmitting ? 'جاري الحفظ...' : 'حفظ ونشر'}
                    </button>
                    <button type="button" onClick={() => router.back()} className="dashboard__form-cancel">
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    );
}
