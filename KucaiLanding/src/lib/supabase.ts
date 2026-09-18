import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Rate = {
  id: number;
  item: string;      // 'BGL' | 'DL'
  buy_price: number;
  sell_price: number;
  updated_at: string;
};

export type Account = {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  status: string;
  created_at: string;
};

export type Testimonial = {
  id: number;
  buyer_name: string;
  item_bought: string;
  rating: number;
  content: string;
  image_url: string;
  created_at: string;
};

export type Reputation = {
  id: number;
  buyer_name: string;
  message: string;
  status: string;
  created_at: string;
};
