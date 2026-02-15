'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormData } from '@/lib/validators';
import { supabase } from '@/lib/supabaseClient';
import type { Category } from '@/lib/types';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        const { data } = await supabase.from('categories').select('*').order('name');
        if (data) setCategories(data);
    }

    const onSubmit = async (data: CategoryFormData) => {
        const { error } = await supabase.from('categories').insert([data]);
        if (!error) {
            reset();
            fetchCategories();
            await fetch('/api/revalidate?path=/'); // Revalidate cache
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm('حذف التصنيف؟')) return;
        await supabase.from('categories').delete().eq('id', id);
        fetchCategories();
    };

    return (
        <div>
            <div className="dashboard__page-header">
                <h1 className="dashboard__page-header-title">إدارة التصنيفات</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="dashboard__form-card h-fit">
                    <h2 className="text-xl font-bold text-white mb-4">إضافة تصنيف جديد</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="dashboard__form-label">اسم التصنيف</label>
                            <input {...register('name')} className="dashboard__form-input" />
                            {errors.name && <p className="dashboard__form-error">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="dashboard__form-label">الرابط (Slug)</label>
                            <input {...register('slug')} className="dashboard__form-input" dir="ltr" />
                            {errors.slug && <p className="dashboard__form-error">{errors.slug.message}</p>}
                        </div>

                        <div>
                            <label className="dashboard__form-label">وصف (اختياري)</label>
                            <textarea {...register('description')} className="dashboard__form-textarea" rows={3} />
                        </div>

                        <button type="submit" className="dashboard__form-submit w-full">
                            إضافة
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="dashboard__cat-list">
                    {categories.map((cat) => (
                        <div key={cat.id} className="dashboard__cat-item">
                            <div>
                                <div className="dashboard__cat-name">{cat.name}</div>
                                <div className="dashboard__cat-slug">/{cat.slug}</div>
                                <div className="dashboard__cat-desc">{cat.description}</div>
                            </div>
                            <button
                                onClick={() => deleteCategory(cat.id)}
                                className="dashboard__btn-delete"
                            >
                                حذف
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
