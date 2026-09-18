import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://growtopiagame.com/detail', { 
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const text = await res.text();
    const data = JSON.parse(text);
    
  
    let wotd = "N/A";
    if (data?.world_day_images?.full_size) {
      const url = data.world_day_images.full_size;
      const match = url.match(/\/worlds\/([^/]+)\.png/);
      if (match && match[1]) {
        wotd = match[1].toUpperCase();
      }
    }
    
    return NextResponse.json({
      online_user: data?.online_user || "70000",
      wotd: wotd
    });
  } catch (error) {
    return NextResponse.json({ 
      online_user: "75000+", 
      wotd: "Harvest Festival" 
    });
  }
}
