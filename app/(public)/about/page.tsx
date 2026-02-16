export const metadata = {
    title: 'من نحن | أصل الحكاية',
    description: 'تعرف على فريق أصل الحكاية ورسالتنا في تقديم محتوى الجرائم الحقيقية.',
};

export default function AboutPage() {
    return (
        <div className="about" itemScope itemType="https://schema.org/AboutPage">
            <div className="about__container">
                {/* Header */}
                <div className="about__header">
                    <h1 className="gradient-text">من نحن</h1>
                    <div className="about__divider" />
                </div>

                {/* Sections */}
                <div className="about__sections">
                    {/* Story */}
                    <section className="about__section">
                        <div className="about__section-inner">
                            <div className="about__section-icon">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h2 className="about__section-title">قصتنا</h2>
                        </div>
                        <p className="about__section-text">
                            أصل الحكاية هي منصة محتوى عربية متخصصة في تقديم أقوى القصص والجرائم الحقيقية بأسلوب تحليلي مشوّق ومبسط.
                            نهدف إلى تقديم محتوى ممتع ومفيد يستعرض أغرب القضايا الجنائية من مصر والعالم العربي والعالم.
                        </p>
                    </section>

                    {/* Mission */}
                    <section className="about__section">
                        <div className="about__section-inner">
                            <div className="about__section-icon">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h2 className="about__section-title">رسالتنا</h2>
                        </div>
                        <p className="about__section-text">
                            نؤمن بأن القصص الحقيقية أقوى من الخيال. هدفنا هو تقديم هذه القصص بأمانة ومهنية، مع التركيز على التحليل والفهم العميق للأحداث.
                            نحرص على احترام خصوصية الأفراد وتقديم المعلومات بشكل مسؤول.
                        </p>
                    </section>

                    {/* Offerings */}
                    <section className="about__section">
                        <div className="about__section-inner">
                            <div className="about__section-icon">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h2 className="about__section-title">ماذا نقدم</h2>
                        </div>
                        <div className="about__offerings">
                            {[
                                { text: 'تحقيقات معمقة في قضايا جنائية', icon: '🔍' },
                                { text: 'فيديوهات يوتيوب عالية الجودة', icon: '📹' },
                                { text: 'مقالات تحليلية مفصلة', icon: '📝' },
                                { text: 'قصص من مصر والعالم العربي', icon: '🌍' },
                                { text: 'كشف أسرار قضايا غامضة', icon: '🕵️' },
                                { text: 'تحليل نفسي واجتماعي للجرائم', icon: '📊' },
                            ].map((item, i) => (
                                <div key={i} className="about__offering">
                                    <span className="about__offering-emoji">{item.icon}</span>
                                    <span className="about__offering-text">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="about__cta">
                        <h2 className="about__cta-title">انضم إلى مجتمعنا</h2>
                        <p className="about__cta-desc">تابعنا على يوتيوب واشترك في القناة ليصلك كل جديد</p>
                        <a
                            href="https://youtube.com/@aslelhekaya"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="about__cta-btn"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            تابعنا على يوتيوب
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
