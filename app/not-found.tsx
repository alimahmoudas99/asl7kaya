import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة - 404',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
    return (
        <div className="not-found">
            <div className="not-found__container">
                <div className="not-found__code">
                    404
                </div>
                <h1 className="not-found__title">الصفحة غير موجودة</h1>
                <p className="not-found__desc">الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
                <Link
                    href="/"
                    className="not-found__btn"
                >
                    العودة للرئيسية
                </Link>
            </div>
        </div>
    );
}
