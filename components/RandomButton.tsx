'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RandomButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/random');
            const data = await res.json();
            if (data.slug) {
                router.push(`/videos/${data.slug}`);
            }
        } catch (error) {
            console.error('Failed to fetch random video:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="random-button"
            disabled={loading}
            aria-label="قصة عشوائية"
            title="قصة عشوائية"
        >
            <svg className="random-button__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
            </svg>
            <span className="random-button__text">قصة عشوائية</span>
        </button>
    );
}
