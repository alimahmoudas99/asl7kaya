'use client';

import { useState } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage('تم الاشتراك بنجاح! 🎉');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'حدث خطأ، حاول مرة أخرى');
            }
        } catch {
            setStatus('error');
            setMessage('حدث خطأ في الاتصال');
        }

        // Reset status after 4 seconds
        setTimeout(() => {
            setStatus('idle');
            setMessage('');
        }, 4000);
    };

    return (
        <section className="newsletter">
            <div className="newsletter__box">
                <div className="newsletter__radial" />
                <div className="newsletter__content">
                    <div className="newsletter__icon">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                    </div>
                    <h2 className="newsletter__title">قصة الأسبوع في بريدك</h2>
                    <p className="newsletter__desc">
                        اشترك ليصلك أقوى القصص والجرائم الحقيقية كل أسبوع مباشرة في بريدك الإلكتروني
                    </p>

                    <form onSubmit={handleSubmit} className="newsletter__form">
                        <div className="newsletter__input-group">
                            <input
                                type="email"
                                placeholder="أدخل بريدك الإلكتروني..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="newsletter__input"
                                required
                                disabled={status === 'loading'}
                            />
                            <button
                                type="submit"
                                className="newsletter__btn"
                                disabled={status === 'loading' || !email}
                            >
                                {status === 'loading' ? (
                                    <span className="newsletter__spinner" />
                                ) : (
                                    'اشترك الآن'
                                )}
                            </button>
                        </div>
                    </form>

                    {message && (
                        <div className={`newsletter__message newsletter__message--${status}`}>
                            {message}
                        </div>
                    )}

                    <p className="newsletter__note">
                        لا نرسل رسائل مزعجة أبداً. يمكنك إلغاء الاشتراك في أي وقت.
                    </p>
                </div>
            </div>
        </section>
    );
}
