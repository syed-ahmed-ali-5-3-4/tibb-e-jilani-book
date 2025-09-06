import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Chapter {
  id: string;
  title: string;
  content: string;
  language: 'english' | 'urdu';
  order: number;
  images?: string[];
}

export interface Bookmark {
  id: string;
  chapterId: string;
  position: number;
  note?: string;
  createdAt: Date;
}

export interface Note {
  id:string;
  chapterId: string;
  position: number;
  text: string;
  createdAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  approved: boolean;
  createdAt: Date;
}

interface BookContextType {
  chapters: Chapter[];
  bookmarks: Bookmark[];
  notes: Note[];
  testimonials: Testimonial[];
  currentChapter: Chapter | null;
  loading: boolean;
  setCurrentChapter: (chapter: Chapter) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (id: string, text: string) => void;
  removeNote: (id: string) => void;
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'approved'>) => void;
  searchChapters: (query: string) => Chapter[];
  // Admin functions
  addChapter: (chapter: Omit<Chapter, 'id'>) => void;
  updateChapter: (id: string, chapter: Omit<Chapter, 'id'>) => void;
  deleteChapter: (id: string) => void;
  updateTestimonial: (id: string, testimonial: Partial<Omit<Testimonial, 'id'>>) => void;
  removeTestimonial: (id: string) => void;
  refreshData: () => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      // Load chapters
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .order('order');
      
      if (chaptersError) throw chaptersError;
      
      const formattedChapters = chaptersData?.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        content: chapter.content,
        language: chapter.language as 'english' | 'urdu',
        order: chapter.order,
        images: chapter.images || []
      })) || [];
      
      setChapters(formattedChapters);

      // Load testimonials
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (testimonialsError) throw testimonialsError;
      
      const formattedTestimonials = testimonialsData?.map(testimonial => ({
        id: testimonial.id,
        name: testimonial.name,
        text: testimonial.text,
        rating: testimonial.rating,
        approved: testimonial.approved,
        createdAt: new Date(testimonial.created_at)
      })) || [];
      
      setTestimonials(formattedTestimonials);

      // Load bookmarks
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (bookmarksError) throw bookmarksError;
      
      const formattedBookmarks = bookmarksData?.map(bookmark => ({
        id: bookmark.id,
        chapterId: bookmark.chapter_id,
        position: bookmark.position,
        note: bookmark.note || undefined,
        createdAt: new Date(bookmark.created_at)
      })) || [];
      
      setBookmarks(formattedBookmarks);

      // Load notes
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (notesError) throw notesError;
      
      const formattedNotes = notesData?.map(note => ({
        id: note.id,
        chapterId: note.chapter_id,
        position: note.position,
        text: note.text,
        createdAt: new Date(note.created_at)
      })) || [];
      
      setNotes(formattedNotes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          chapter_id: bookmark.chapterId,
          position: bookmark.position,
          note: bookmark.note
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newBookmark: Bookmark = {
        id: data.id,
        chapterId: data.chapter_id,
        position: data.position,
        note: data.note || undefined,
        createdAt: new Date(data.created_at)
      };
      
      setBookmarks(prev => [...prev, newBookmark]);
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const removeBookmark = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setBookmarks(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const addNote = async (note: Omit<Note, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          chapter_id: note.chapterId,
          position: note.position,
          text: note.text
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newNote: Note = {
        id: data.id,
        chapterId: data.chapter_id,
        position: data.position,
        text: data.text,
        createdAt: new Date(data.created_at)
      };
      
      setNotes(prev => [...prev, newNote]);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const updateNote = async (id: string, text: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ text })
        .eq('id', id);
      
      if (error) throw error;
      
      setNotes(prev => prev.map(n => n.id === id ? { ...n, text } : n));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const removeNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error removing note:', error);
    }
  };

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'approved'>) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert({
          name: testimonial.name,
          text: testimonial.text,
          rating: testimonial.rating,
          approved: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newTestimonial: Testimonial = {
        id: data.id,
        name: data.name,
        text: data.text,
        rating: data.rating,
        approved: data.approved,
        createdAt: new Date(data.created_at)
      };
      
      setTestimonials(prev => [...prev, newTestimonial]);
    } catch (error) {
      console.error('Error adding testimonial:', error);
    }
  };

  const searchChapters = (query: string): Chapter[] => {
    if (!query.trim()) return chapters;
    return chapters.filter(c => c.title.toLowerCase().includes(query.toLowerCase()) || c.content.toLowerCase().includes(query.toLowerCase()));
  };

  // Admin Functions
  const addChapter = async (chapter: Omit<Chapter, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .insert({
          title: chapter.title,
          content: chapter.content,
          language: chapter.language,
          order: chapter.order,
          images: chapter.images || []
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newChapter: Chapter = {
        id: data.id,
        title: data.title,
        content: data.content,
        language: data.language as 'english' | 'urdu',
        order: data.order,
        images: data.images || []
      };
      
      setChapters(prev => [...prev, newChapter].sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error adding chapter:', error);
    }
  };

  const updateChapter = async (id: string, chapter: Omit<Chapter, 'id'>) => {
    try {
      const { error } = await supabase
        .from('chapters')
        .update({
          title: chapter.title,
          content: chapter.content,
          language: chapter.language,
          order: chapter.order,
          images: chapter.images || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setChapters(prev => prev.map(c => c.id === id ? { ...chapter, id } : c).sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error updating chapter:', error);
    }
  };

  const deleteChapter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setChapters(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  const updateTestimonial = async (id: string, testimonialUpdate: Partial<Omit<Testimonial, 'id'>>) => {
    try {
      const updateData: any = {};
      if (testimonialUpdate.name !== undefined) updateData.name = testimonialUpdate.name;
      if (testimonialUpdate.text !== undefined) updateData.text = testimonialUpdate.text;
      if (testimonialUpdate.rating !== undefined) updateData.rating = testimonialUpdate.rating;
      if (testimonialUpdate.approved !== undefined) updateData.approved = testimonialUpdate.approved;
      
      const { error } = await supabase
        .from('testimonials')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...testimonialUpdate } : t));
    } catch (error) {
      console.error('Error updating testimonial:', error);
    }
  };

  const removeTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error removing testimonial:', error);
    }
  };

  const value: BookContextType = {
    chapters,
    bookmarks,
    notes,
    testimonials,
    currentChapter,
    loading,
    setCurrentChapter,
    addBookmark,
    removeBookmark,
    addNote,
    updateNote,
    removeNote,
    addTestimonial,
    searchChapters,
    addChapter,
    updateChapter,
    deleteChapter,
    updateTestimonial,
    removeTestimonial,
    refreshData,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBook = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) throw new Error('useBook must be used within a BookProvider');
  return context;
};
