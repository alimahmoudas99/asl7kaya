'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

import type { Video } from '@/lib/types';

// Simple debounce implementation
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
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const debouncedQuery = useDebounceValue(query, 300);

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
                setActiveIndex(-1);
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

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!open || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && results[activeIndex]) {
                    window.location.href = `/videos/${results[activeIndex].slug}`;
                    setOpen(false);
                }
                break;
            case 'Escape':
                setOpen(false);
                break;
        }
    }, [open, results, activeIndex]);

    // Scroll active item into view
    useEffect(() => {
        if (activeIndex >= 0 && listRef.current) {
            const items = listRef.current.querySelectorAll('.search-bar__result');
            items[activeIndex]?.scrollIntoView({ block: 'nearest' });
        }
    }, [activeIndex]);

    // Highlight matching text
    const highlightText = (text: string, query: string) => {
        if (!query || query.length < 2) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part) ? <mark key={i} className="search-bar__highlight">{part}</mark> : part
        );
    };

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
                    onKeyDown={handleKeyDown}
                />
                {loading ? (
                    <div className="search-bar__spinner" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="search-bar__icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                )}
            </div>

            {open && query.length >= 2 && (
                <>
                    {results.length > 0 ? (
                        <div className="search-bar__dropdown search-bar__dropdown--animated" ref={listRef}>
                            {results.map((video, index) => (
                                <Link
                                    key={video.id}
                                    href={`/videos/${video.slug}`}
                                    className={`search-bar__result ${index === activeIndex ? 'search-bar__result--active' : ''}`}
                                    onClick={() => setOpen(false)}
                                >
                                    <div
                                        className="search-bar__result-thumb"
                                        style={{ backgroundImage: video.thumbnail_url ? `url(${video.thumbnail_url})` : undefined }}
                                    />
                                    <div className="search-bar__result-info">
                                        <div className="search-bar__result-title">{highlightText(video.title, query)}</div>
                                        <div className="search-bar__result-excerpt">{video.excerpt}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="search-bar__no-results">
                            {loading ? (
                                <div className="search-bar__loading-text">
                                    <div className="search-bar__spinner search-bar__spinner--inline" />
                                    جاري البحث...
                                </div>
                            ) : 'لا توجد نتائج'}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
