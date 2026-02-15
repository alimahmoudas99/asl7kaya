'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/lib/validators';
import { submitContactMessage } from '@/lib/queries';

export default function ContactPage() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setSubmitError('');
        setIsSuccess(false);

        const success = await submitContactMessage(data.name, data.email, data.message);

        if (success) {
            setIsSuccess(true);
            reset();
        } else {
            setSubmitError('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
        }
    };

    return (
        <div className="contact">
            <div className="contact__container">
                <div className="contact__header">
                    <h1 className="gradient-text">اتصل بنا</h1>
                    <p className="contact__header-desc">لديك سؤال أو اقتراح؟ تواصل معنا وسنرد عليك في أقرب وقت.</p>
                    <div className="contact__divider" />
                </div>

                {isSuccess && (
                    <div className="contact__success">
                        تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا.
                    </div>
                )}

                {submitError && (
                    <div className="contact__error">
                        {submitError}
                    </div>
                )}

                <div className="contact__form">
                    <form onSubmit={handleSubmit(onSubmit)} className="contact__form-card">
                        {/* Name */}
                        <div className="contact__field">
                            <label htmlFor="name" className="contact__field-label">الاسم</label>
                            <input
                                id="name"
                                {...register('name')}
                                className="contact__field-input"
                                placeholder="أدخل اسمك"
                            />
                            {errors.name && <p className="contact__field-error">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="contact__field">
                            <label htmlFor="email" className="contact__field-label">البريد الإلكتروني</label>
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                className="contact__field-input"
                                placeholder="example@email.com"
                                dir="ltr"
                            />
                            {errors.email && <p className="contact__field-error">{errors.email.message}</p>}
                        </div>

                        {/* Message */}
                        <div className="contact__field">
                            <label htmlFor="message" className="contact__field-label">الرسالة</label>
                            <textarea
                                id="message"
                                {...register('message')}
                                className="contact__field-textarea"
                                rows={5}
                                placeholder="اكتب رسالتك هنا..."
                            />
                            {errors.message && <p className="contact__field-error">{errors.message.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="contact__submit-btn"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="animate-spin ml-2">↻</span>
                                    جاري الإرسال...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    إرسال الرسالة
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="contact__info-grid">
                    <div className="contact__info-card">
                        <div className="contact__info-card-icon">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="contact__info-card-title">البريد الإلكتروني</h3>
                        <p className="contact__info-card-value">info@asl7kaya.com</p>
                    </div>

                    <a href="https://youtube.com/@aslelhekaya" target="_blank" rel="noopener noreferrer" className="contact__info-card">
                        <div className="contact__info-card-icon">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </div>
                        <h3 className="contact__info-card-title">يوتيوب</h3>
                        <p className="contact__info-card-value">أصل الحكاية</p>
                    </a>
                </div>
            </div>
        </div>
    );
}
