import { NextResponse } from 'next/server';

export async function GET() {
  // In a real production environment, you would use Instagram Graph API and TikTok API.
  // Scraping these platforms directly from Vercel edge functions often results in 403 Forbidden.
  // For now, this returns a mock/cached value to simulate real-time fetching.
  
  try {
    // You could put your actual API fetch logic here if you have keys.
    // e.g., const res = await fetch('https://graph.instagram.com/...');
    
    return NextResponse.json({
      ig: "1.1K",
      tt: "1.2K"
    });
  } catch (error) {
    return NextResponse.json({
      ig: "1.1K",
      tt: "1.2K"
    });
  }
}
