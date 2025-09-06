import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      chapters: {
        Row: {
          id: string;
          title: string;
          content: string;
          language: 'english' | 'urdu';
          order: number;
          images: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          language: 'english' | 'urdu';
          order: number;
          images?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          language?: 'english' | 'urdu';
          order?: number;
          images?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          text: string;
          rating: number;
          approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          text: string;
          rating: number;
          approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          text?: string;
          rating?: number;
          approved?: boolean;
          created_at?: string;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          chapter_id: string;
          position: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          position: number;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          position?: number;
          note?: string | null;
          created_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          chapter_id: string;
          position: number;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          position: number;
          text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          position?: number;
          text?: string;
          created_at?: string;
        };
      };
    };
  };
}