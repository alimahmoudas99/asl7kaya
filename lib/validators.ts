import { z } from 'zod';

export const videoSchema = z.object({
    title: z.string().min(3, 'العنوان مطلوب (3 أحرف على الأقل)'),
    slug: z.string().min(3, 'الرابط المختصر مطلوب').regex(/^[a-z0-9-\u0600-\u06FF]+$/, 'الرابط يجب أن يحتوي على أحرف (عربية أو إنجليزية) وأرقام وشرطات فقط'),
    excerpt: z.string().min(10, 'الوصف المختصر مطلوب (10 أحرف على الأقل)'),
    content: z.string().min(50, 'المحتوى مطلوب (50 حرف على الأقل)'),
    youtube_id: z.string().min(5, 'معرّف يوتيوب مطلوب'),
    thumbnail_url: z.string().nullable().optional().or(z.literal('')),
    location: z.string().optional(),
    people_involved: z.array(z.string()).optional(),
    category_id: z.string().uuid('اختر تصنيفاً صالحاً').optional().or(z.literal('')),
});

export const categorySchema = z.object({
    name: z.string().min(2, 'اسم التصنيف مطلوب'),
    slug: z.string().min(2, 'الرابط المختصر مطلوب').regex(/^[a-z0-9-\u0600-\u06FF]+$/, 'الرابط يجب أن يحتوي على أحرف (عربية أو إنجليزية) وأرقام وشرطات فقط'),
    description: z.string().optional(),
});

export const contactSchema = z.object({
    name: z.string().min(2, 'الاسم مطلوب'),
    email: z.string().email('البريد الإلكتروني غير صالح'),
    message: z.string().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل'),
});

export type VideoFormData = z.infer<typeof videoSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
