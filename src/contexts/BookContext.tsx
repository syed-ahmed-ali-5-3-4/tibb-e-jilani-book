import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { faker } from '@faker-js/faker';

export interface Chapter {
  id: string;
  title: string;
  content: string;
  language: 'english' | 'urdu';
  order: number;
  imageUrl?: string;
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
}

const BookContext = createContext<BookContextType | undefined>(undefined);

// Mock data is now a fallback if nothing is in storage
const mockChapters: Chapter[] = [
  { id: '1', title: 'Introduction to Islamic Healthcare Philosophy', content: `In the name of Allah, the Most Gracious, the Most Merciful...`, language: 'english', order: 1 },
  { id: '2', title: 'The Sacred Trust of the Body', content: `The human body is described in the Quran as an Amanah...`, language: 'english', order: 2, imageUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/800x1200.png?text=Scanned+Page' },
  { id: '3', title: 'Spiritual Dimensions of Medical Decision-Making', content: `The intersection of spirituality and healthcare...`, language: 'english', order: 3 },
  { id: '4', title: 'اسلامی صحت کی فلسفہ کا تعارف', content: `بسم اللہ الرحمن الرحیم...`, language: 'urdu', order: 1 },
  { id: '5', title: 'جسم کی مقدس امانت', content: `قرآن مجید میں انسانی جسم کو اللہ کی طرف سے امانت...`, language: 'urdu', order: 2 }
];

const mockTestimonials: Testimonial[] = [
  { id: '1', name: 'Dr. Ahmed Hassan', text: 'This book beautifully bridges the gap between modern medical ethics and Islamic principles. A must-read for healthcare professionals.', rating: 5, approved: true, createdAt: new Date('2024-01-15') },
  { id: '2', name: 'Sister Fatima', text: 'The wisdom shared in this book helped me make difficult healthcare decisions for my elderly mother. Truly enlightening.', rating: 5, approved: false, createdAt: new Date('2024-01-20') },
  { id: '3', name: 'Professor Mahmoud', text: 'An excellent resource that combines spiritual insight with practical guidance. The Sufi perspective adds depth to medical decision-making.', rating: 4, approved: true, createdAt: new Date('2024-02-01') }
];

// Helper to get data from localStorage
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return defaultValue;

    const parsed = JSON.parse(item);
    // Re-hydrate dates, which are lost during JSON serialization
    if (Array.isArray(parsed) && parsed.length > 0 && 'createdAt' in parsed[0]) {
      return parsed.map((i: any) => ({ ...i, createdAt: new Date(i.createdAt) })) as T;
    }
    return parsed;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

// Helper to set data to localStorage
const setToStorage = <T,>(key: string, value: T) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key “${key}”:`, error);
  }
};


export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chapters, setChapters] = useState<Chapter[]>(() => getFromStorage('chapters', mockChapters));
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => getFromStorage('bookmarks', []));
  const [notes, setNotes] = useState<Note[]>(() => getFromStorage('notes', []));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => getFromStorage('testimonials', mockTestimonials));
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);

  // Effects to persist state changes to localStorage
  useEffect(() => { setToStorage('chapters', chapters); }, [chapters]);
  useEffect(() => { setToStorage('bookmarks', bookmarks); }, [bookmarks]);
  useEffect(() => { setToStorage('notes', notes); }, [notes]);
  useEffect(() => { setToStorage('testimonials', testimonials); }, [testimonials]);

  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark: Bookmark = { ...bookmark, id: faker.string.uuid(), createdAt: new Date() };
    setBookmarks(prev => [...prev, newBookmark]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = { ...note, id: faker.string.uuid(), createdAt: new Date() };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, text: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, text } : n));
  };

  const removeNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const addTestimonial = (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'approved'>) => {
    const newTestimonial: Testimonial = { ...testimonial, id: faker.string.uuid(), approved: false, createdAt: new Date() };
    setTestimonials(prev => [...prev, newTestimonial]);
  };

  const searchChapters = (query: string): Chapter[] => {
    if (!query.trim()) return chapters;
    return chapters.filter(c => c.title.toLowerCase().includes(query.toLowerCase()) || c.content.toLowerCase().includes(query.toLowerCase()));
  };

  // Admin Functions
  const addChapter = (chapter: Omit<Chapter, 'id'>) => {
    const newChapter: Chapter = { ...chapter, id: faker.string.uuid() };
    setChapters(prev => [...prev, newChapter].sort((a, b) => a.order - b.order));
  };

  const updateChapter = (id: string, chapter: Omit<Chapter, 'id'>) => {
    setChapters(prev => prev.map(c => c.id === id ? { ...chapter, id } : c).sort((a, b) => a.order - b.order));
  };

  const deleteChapter = (id: string) => {
    setChapters(prev => prev.filter(c => c.id !== id));
  };

  const updateTestimonial = (id: string, testimonialUpdate: Partial<Omit<Testimonial, 'id'>>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...testimonialUpdate } : t));
  };

  const removeTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const value: BookContextType = {
    chapters,
    bookmarks,
    notes,
    testimonials,
    currentChapter,
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
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBook = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) throw new Error('useBook must be used within a BookProvider');
  return context;
};
