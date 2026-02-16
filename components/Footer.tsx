import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer__gradient-line" />

            <div className="footer__container">
                <div className="footer__grid">
                    {/* Brand */}
                    <div className="footer__brand">
                        <Link href="/" className="footer__brand-logo">
                            <div className="footer__brand-logo-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="footer__brand-logo-text">أصل الحكاية</span>
                        </Link>
                        <p className="footer__brand-desc">
                            أصل الحكاية هي منصة محتوى عربية متخصصة في تقديم أقوى القصص والجرائم الحقيقية بأسلوب تحليلي مشوق.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer__section">
                        <h3 className="footer__section-title">روابط سريعة</h3>
                        <ul className="footer__links">
                            <li><Link href="/" className="footer__link">الرئيسية</Link></li>
                            <li><Link href="/about" className="footer__link">من نحن</Link></li>
                            <li><Link href="/contact" className="footer__link">اتصل بنا</Link></li>
                            <li><Link href="/dashboard" className="footer__link">لوحة التحكم</Link></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="footer__section">
                        <h3 className="footer__section-title">تواصل معنا</h3>
                        <div className="footer__social">
                            <a href="https://www.youtube.com/@AliMahmoud-99" target="_blank" className="footer__social-link footer__social-link--youtube" aria-label="YouTube">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            <a href="#" target="_blank" className="footer__social-link footer__social-link--facebook" aria-label="Facebook">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="#" target="_blank" className="footer__social-link footer__social-link--twitter" aria-label="Twitter">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z" />
                                </svg>
                            </a>
                            <a href="#" target="_blank" className="footer__social-link footer__social-link--instagram" aria-label="Instagram">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88z" />
                                </svg>
                            </a>
                        </div>
                        {/* <p style={{ marginTop: '1rem', color: '#9ca3af', fontSize: '0.875rem' }}>
                            البريد الإلكتروني: info@asl7kaya.com
                        </p> */}
                    </div>
                </div>

                <div className="footer__bottom">
                    <p className="footer__copyright">
                        © {currentYear} أصل الحكاية. جميع الحقوق محفوظة.
                    </p>
                </div>
            </div>
        </footer>
    );
}
