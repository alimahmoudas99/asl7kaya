'use client';

import { useState, KeyboardEvent, useEffect } from 'react';

interface TagInputProps {
    initialTags?: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export default function TagInput({ initialTags = [], onChange, placeholder }: TagInputProps) {
    const [tags, setTags] = useState<string[]>(initialTags);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        setTags(initialTags);
    }, [initialTags]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const addTag = () => {
        const trimmed = inputValue.trim().replace(/,/g, ''); // Remove commas if any
        if (trimmed && !tags.includes(trimmed)) {
            const newTags = [...tags, trimmed];
            setTags(newTags);
            onChange(newTags);
            setInputValue('');
        }
    };

    const removeTag = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
        onChange(newTags);
    };

    return (
        <div className="w-full">
            {/* Tags Container */}
            <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-red-900/30 text-red-400 border border-red-900/50 transition-all hover:bg-red-900/50"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="mr-2 text-red-400/70 hover:text-red-300 w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-900/50 transition-colors"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>

            {/* Input */}
            <div className="relative group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    className="dashboard__form-input !py-3 !px-4 focus:ring-2 focus:ring-primary-600/50 transition-shadow"
                    placeholder={tags.length === 0 ? (placeholder || "اضغط Enter لإضافة وسم...") : "أضف المزيد..."}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">
                    موافق ↵
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">

                افصل بين الأسماء بـ Enter أو علامة الفاصلة
            </p>
        </div>
    );
}
