'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import RandomButton from './RandomButton';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <div className="navbar__container">
                {/* Logo */}
                <Link href="/" className="navbar__logo">
                    <div className="navbar__logo-icon">
                        <div className="navbar__logo-icon-box">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="navbar__logo-icon-glow" />
                    </div>
                    <div>
                        <span className="navbar__logo-text">أصل الحكاية</span>
                        <span className="navbar__logo-sub">ASL EL HEKAYA</span>
                    </div>
                </Link>

                {/* Desktop Search */}
                <div className="navbar__search">
                    <SearchBar />
                </div>

                {/* Desktop Links */}
                <div className="navbar__links">
                    <Link href="/" className="navbar__link">الرئيسية</Link>
                    <Link href="/about" className="navbar__link">من نحن</Link>
                    <Link href="/contact" className="navbar__link">اتصل بنا</Link>
                    <RandomButton />
                </div>

                {/* Mobile Toggle */}
                <button
                    className="navbar__toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`navbar__mobile ${mobileMenuOpen ? 'navbar__mobile--open' : 'navbar__mobile--closed'}`}>
                <div className="navbar__mobile-inner">
                    <div className="navbar__mobile-search">
                        <SearchBar />
                    </div>
                    <Link href="/" className="navbar__mobile-link" onClick={() => setMobileMenuOpen(false)}>
                        الرئيسية
                    </Link>
                    <Link href="/about" className="navbar__mobile-link" onClick={() => setMobileMenuOpen(false)}>
                        من نحن
                    </Link>
                    <Link href="/contact" className="navbar__mobile-link" onClick={() => setMobileMenuOpen(false)}>
                        اتصل بنا
                    </Link>
                    <div style={{ padding: '0 1rem' }}>
                        <RandomButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}
