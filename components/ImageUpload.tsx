'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError('');

            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to 'thumbnails' bucket
            const { error: uploadError } = await supabase.storage
                .from('thumbnails')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data } = supabase.storage
                .from('thumbnails')
                .getPublicUrl(filePath);

            onChange(data.publicUrl);
        } catch (err: any) {
            console.error('Upload Error:', err);
            setError('فشل في رفع الصورة. تأكد من إنشاء Bucket باسم "thumbnails" وأنه "Public".');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="thumbnail-upload w-full">
            {/* Preview */}
            <div
                className={`relative aspect-video w-full max-w-md rounded-xl border-2 border-dashed border-dark-700 bg-dark-900 overflow-hidden flex flex-col items-center justify-center transition-colors ${!value ? 'hover:border-primary-600/50 cursor-pointer' : ''
                    }`}
                onClick={() => !value && fileInputRef.current?.click()}
            >
                {value ? (
                    <>
                        <img
                            src={value}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange('');
                            }}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                            title="حذف الصورة"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <div className="text-center p-4">
                        {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm text-dark-300">جاري الرفع...</span>
                            </div>
                        ) : (
                            <>
                                <svg className="img-svg text-dark-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <div className="text-sm text-dark-300 font-medium">اضغط لرفع صورة</div>
                                <div className="text-xs text-dark-500 mt-1">PNG, JPG حتى 2MB</div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={disabled || uploading}
                className="hidden"
            />

            {/* Manual URL Input (Fallback) */}
            {!value && (
                <div className="mt-3">
                    <span className="text-xs text-dark-500 mb-1 block">أو أدخل رابط مباشر:</span>
                    <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        className="dashboard__form-input text-sm py-2"
                        dir="ltr"
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
}
