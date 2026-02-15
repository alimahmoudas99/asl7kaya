'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

import type { Video } from '@/lib/types';

// Simple debounce implementation inside component to avoid extra file for now
function useDebounceValue(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const debouncedQuery = useDebounceValue(query, 500);

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (debouncedQuery) fetchResults();
    }, [debouncedQuery]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="search-bar" ref={containerRef}>
            <div className="search-bar__input-wrapper">
                <input
                    type="text"
                    placeholder="ابحث عن قصة..."
                    className="search-bar__input"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="search-bar__icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {open && query.length >= 2 && (
                <>
                    {results.length > 0 ? (
                        <div className="search-bar__dropdown">
                            {results.map((video) => (
                                <Link
                                    key={video.id}
                                    href={`/videos/${video.slug}`}
                                    className="search-bar__result"
                                    onClick={() => setOpen(false)}
                                >
                                    <div
                                        className="search-bar__result-thumb"
                                        style={{ backgroundImage: video.thumbnail_url ? `url(${video.thumbnail_url})` : undefined }}
                                    />
                                    <div className="search-bar__result-info">
                                        <div className="search-bar__result-title">{video.title}</div>
                                        <div className="search-bar__result-excerpt">{video.excerpt}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="search-bar__no-results">
                            {loading ? 'جاري البحث...' : 'لا توجد نتائج'}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
