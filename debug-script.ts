
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Manual .env parsing
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim().replace(/"/g, '');
        }
    });
} else {
    console.error('.env.local not found');
    process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkContent() {
    // Get a video
    const { data: videos, error } = await supabase
        .from('videos')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (!videos || videos.length === 0) {
        console.log('No videos found');
        return;
    }

    const video = videos[0];
    console.log('Available Video Keys:', Object.keys(video));

    // Check if there is any other large text column
    for (const [key, value] of Object.entries(video)) {
        if (typeof value === 'string' && value.length > 100) {
            console.log(`Column '${key}' length:`, value.length);
        }
    }
}

checkContent();
