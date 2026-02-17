import { getSupabase } from './supabaseClient';
import type { Video, Category } from './types';

// ─── Videos ──────────────────────────────────────────────

export async function getTrendingVideos(limit = 6) {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('videos')
        .select('*, categories(name, slug)')
        .order('views', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching trending videos:', error);
        return [];
    }
    return (data as Video[]) || [];
}

export async function getLatestVideos(limit = 6) {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('videos')
        .select('*, categories(name, slug)')
        .order('published_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching latest videos:', error);
        return [];
    }
    return (data as Video[]) || [];
}

export async function getBestVideos(limit = 4) {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('videos')
        .select('*, categories(name, slug)')
        .eq('is_best', true)
        .order('published_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching best videos:', error);
        return [];
    }
    return (data as Video[]) || [];
}

export async function getAllVideos() {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('videos')
        .select('*, categories(name, slug)')
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Error fetching all videos:', error);
        return [];
    }
    return (data as Video[]) || [];
}

export async function getVideoBySlug(slug: string) {
    const supabase = getSupabase();
    if (!supabase) return null;

    // 1. Try matching with the provided slug
    let { data, error } = await supabase
        .from('videos')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .single();

    // 2. Fallback: If not found and slug looks encoded, try matching with decoded version
    if (!data && slug.includes('%')) {
        try {
            const decodedSlug = decodeURIComponent(slug);
            const { data: decodedData, error: decodedError } = await supabase
                .from('videos')
                .select('*, categories(name, slug)')
                .eq('slug', decodedSlug)
                .single();

            if (decodedData) {
                data = decodedData;
                error = decodedError;
            }
        } catch (e) {
            // Decoding failed, ignore fallback
        }
    }

    if (error) {
        console.error('Error fetching video by slug:', error);
        return null;
    }
    return data as Video;
}

export async function getVideosByCategory(categoryId: string) {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('videos')
        .select('*, categories(name, slug)')
        .eq('category_id', categoryId)
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Error fetching videos by category:', error);
        return [];
    }
    return (data as Video[]) || [];
}

export async function getRelatedVideos(categoryId: string | null, currentVideoId: string, limit = 4) {
    const supabase = getSupabase();
    if (!supabase) return [];

    let query = supabase
        .from('videos')
        .select('*, categories(name, slug)')
        .neq('id', currentVideoId)
        .order('published_at', { ascending: false })
        .limit(limit);

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching related videos:', error);
        return [];
    }
    return (data as Video[]) || [];
}

export async function searchVideos(query: string) {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('videos')
        .select('id, title, slug, excerpt, thumbnail_url')
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .order('published_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error searching videos:', error);
        return [];
    }
    return data || [];
}

// ─── Categories ──────────────────────────────────────────

export async function getAllCategories() {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return (data as Category[]) || [];
}

export async function getCategoryBySlug(slug: string) {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching category by slug:', error);
        return null;
    }
    return data as Category;
}

// ─── Contact ─────────────────────────────────────────────

export async function submitContactMessage(name: string, email: string, message: string) {
    const supabase = getSupabase();
    if (!supabase) return false;

    const { error } = await supabase
        .from('contact_messages')
        .insert({ name, email, message });

    if (error) {
        console.error('Error submitting contact message:', error);
        return false;
    }
    return true;
}

export async function incrementVideoViews(videoId: string) {
    const supabase = getSupabase();
    if (!supabase) return;

    // Use RPC for atomic increment to avoid race conditions
    // Requires a Supabase function: 
    // CREATE OR REPLACE FUNCTION increment_views(video_id UUID) 
    // RETURNS void AS $$ 
    // BEGIN 
    //   UPDATE videos SET views = views + 1 WHERE id = video_id; 
    // END; $$ LANGUAGE plpgsql;

    // Fallback to direct update if RPC is not set up yet (less efficient/accurate)
    const { error } = await supabase.rpc('increment_views', { video_id: videoId });

    if (error) {
        console.warn('RPC increment_views failed, falling back to direct increment:', error);
        // Direct increment fallback
        const { data: current } = await supabase.from('videos').select('views').eq('id', videoId).single();
        if (current) {
            await supabase.from('videos').update({ views: (current.views || 0) + 1 }).eq('id', videoId);
        }
    }
}
