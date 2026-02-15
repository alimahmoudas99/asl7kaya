'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError('بيانات الدخول غير صحيحة');
            setLoading(false);
            return;
        }

        router.push('/dashboard');
    };

    return (
        <div className="login">
            <div className="login__container">
                {/* Logo */}
                <div className="login__header">
                    <div className="login__icon-box">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="login__title">لوحة التحكم</h1>
                    <p className="login__subtitle">أصل الحكاية - تسجيل الدخول</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="login__form">
                    {error && (
                        <div className="login__error">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="login__field-label">
                            البريد الإلكتروني
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login__field-input"
                            placeholder="admin@example.com"
                            dir="ltr"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="login__field-label">
                            كلمة المرور
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login__field-input"
                            placeholder="••••••••"
                            dir="ltr"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="login__submit"
                    >
                        {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                    </button>
                </form>
            </div>
        </div>
    );
}
