import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  MessageSquare, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X,
  Users,
  FileText,
  Eye,
  Star,
  Image as ImageIcon,
  Upload,
  Loader2
} from 'lucide-react';
import { useBook, Chapter } from '../contexts/BookContext';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const AdminPortal: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/chapters" element={<ChapterManagement />} />
        <Route path="/testimonials" element={<TestimonialManagement />} />
      </Routes>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { chapters, testimonials, loading } = useBook();
  
  const englishChapters = chapters.filter(c => c.language === 'english').length;
  const urduChapters = chapters.filter(c => c.language === 'urdu').length;
  const pendingTestimonials = testimonials.filter(t => !t.approved).length;
  const approvedTestimonials = testimonials.filter(t => t.approved).length;

  const stats = [
    { title: 'English Chapters', value: englishChapters, icon: BookOpen, color: 'text-blue-400' },
    { title: 'Urdu Chapters', value: urduChapters, icon: BookOpen, color: 'text-green-400' },
    { title: 'Pending Reviews', value: pendingTestimonials, icon: MessageSquare, color: 'text-yellow-400' },
    { title: 'Approved Reviews', value: approvedTestimonials, icon: Users, color: 'text-islamic-gold-400' }
  ];

  const menuItems = [
    { title: 'Manage Chapters', description: 'Add, edit, or delete book chapters', icon: FileText, path: '/admin/chapters' },
    { title: 'Manage Testimonials', description: 'Approve or delete reader reviews', icon: MessageSquare, path: '/admin/testimonials' }
  ];

  return (
    <>
      <Header title="Admin Portal" showHome />
      <div className="container mx-auto px-4 py-6">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-islamic-gold-400" />
            <span className="ml-2 text-white">Loading data...</span>
          </div>
        )}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card><div className="text-center"><stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} /><div className="text-2xl font-bold text-white mb-1">{stat.value}</div><div className="text-white/60 text-sm">{stat.title}</div></div></Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold bg-gold-text bg-clip-text text-transparent">Management Tools</h2>
            {menuItems.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.1 }}>
                <Card hover onClick={() => navigate(item.path)}><div className="flex items-center"><div className="w-12 h-12 bg-islamic-gold-400/20 border border-islamic-gold-500 rounded-lg flex items-center justify-center mr-4"><item.icon className="w-6 h-6 text-islamic-gold-400" /></div><div className="flex-1"><h3 className="font-bold text-white">{item.title}</h3><p className="text-white/60 text-sm">{item.description}</p></div></div></Card>
              </motion.div>
            ))}
          </div>
           <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center text-islamic-gold-400 hover:text-islamic-gold-300 transition-colors">
              <Eye className="w-4 h-4 mr-2" />
              View Live Site
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

// Reusable component for displaying a chapter card in the admin panel
const AdminChapterCard: React.FC<{
  chapter: Chapter;
  onEdit: (chapter: Chapter) => void;
  onDelete: (id: string) => void;
}> = ({ chapter, onEdit, onDelete }) => (
  <Card>
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-white mb-2 truncate" dir={chapter.language === 'urdu' ? 'rtl' : 'ltr'}>
          {chapter.title}
        </h3>
        <div className="flex items-center text-white/60 text-sm mb-2">
          <span>Order: {chapter.order}</span>
        </div>
        {chapter.images && chapter.images.length > 0 ? (
            <div className="text-white/80 text-sm flex items-center">
                <ImageIcon className="w-4 h-4 mr-2 text-islamic-gold-400" />
                <span>{chapter.images.length} image{chapter.images.length > 1 ? 's' : ''}</span>
            </div>
        ) : (
            <p className="text-white/80 text-sm line-clamp-2" dir={chapter.language === 'urdu' ? 'rtl' : 'ltr'}>
                {chapter.content}
            </p>
        )}
      </div>
      <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
        <Button variant="ghost" size="sm" icon={Edit3} onClick={() => onEdit(chapter)} />
        <Button variant="ghost" size="sm" icon={Trash2} onClick={() => onDelete(chapter.id)} className="text-red-400 hover:text-red-300" />
      </div>
    </div>
  </Card>
);

const ChapterManagement: React.FC = () => {
  const { chapters, deleteChapter } = useBook();
  const [showForm, setShowForm] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingChapter(null);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this chapter? This action cannot be undone.')) {
      deleteChapter(id);
    }
  };

  const englishChapters = chapters.filter(c => c.language === 'english').sort((a, b) => a.order - b.order);
  const urduChapters = chapters.filter(c => c.language === 'urdu').sort((a, b) => a.order - b.order);

  return (
    <>
      <Header title="Chapter Management" showBack showHome />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold bg-gold-text bg-clip-text text-transparent">Manage Chapters</h2>
          <Button icon={Plus} onClick={handleAdd}>Add Chapter</Button>
        </div>

        {/* English Section */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-white mb-4 border-b-2 border-islamic-gold-700/50 pb-2">
            English Chapters ({englishChapters.length})
          </h3>
          <div className="space-y-4">
            {englishChapters.length > 0 ? (
              englishChapters.map((chapter) => (
                <AdminChapterCard key={chapter.id} chapter={chapter} onEdit={handleEdit} onDelete={handleDelete} />
              ))
            ) : (
              <Card><p className="text-white/60 text-center py-4">No English chapters have been added yet.</p></Card>
            )}
          </div>
        </section>

        {/* Urdu Section */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 border-b-2 border-islamic-gold-700/50 pb-2 font-urdu" dir="rtl">
            اردو ابواب ({urduChapters.length})
          </h3>
          <div className="space-y-4">
            {urduChapters.length > 0 ? (
              urduChapters.map((chapter) => (
                <AdminChapterCard key={chapter.id} chapter={chapter} onEdit={handleEdit} onDelete={handleDelete} />
              ))
            ) : (
              <Card><p className="text-white/60 text-center py-4 font-urdu" dir="rtl">ابھی تک کوئی اردو ابواب شامل نہیں کیے گئے ہیں۔</p></Card>
            )}
          </div>
        </section>
      </div>
      <ChapterForm isOpen={showForm} onClose={() => setShowForm(false)} chapter={editingChapter} />
    </>
  );
};


const ChapterForm: React.FC<{ isOpen: boolean; onClose: () => void; chapter: Chapter | null }> = ({ isOpen, onClose, chapter }) => {
  const { addChapter, updateChapter, chapters } = useBook();
  const [formData, setFormData] = useState({ title: '', content: '', language: 'english' as 'english' | 'urdu', order: 1, images: [] as string[] });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (chapter) {
        setFormData({ title: chapter.title, content: chapter.content, language: chapter.language, order: chapter.order, images: chapter.images || [] });
        setImagePreviews(chapter.images || []);
      } else {
        setFormData({ title: '', content: '', language: 'english', order: chapters.length + 1, images: [] });
        setImagePreviews([]);
      }
    }
  }, [chapter, isOpen, chapters.length]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploading(true);
      const files = Array.from(e.target.files);
      const newImages: string[] = [];
      
      for (const file of files) {
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            newImages.push(dataUrl);
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
      
      const updatedImages = [...formData.images, ...newImages];
      setFormData({ ...formData, images: updatedImages });
      setImagePreviews(updatedImages);
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
    setImagePreviews(updatedImages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    const chapterData = { ...formData, order: Number(formData.order) };
    if (chapter) {
      updateChapter(chapter.id, chapterData);
    } else {
      addChapter(chapterData);
    }
    onClose();
  };

  const isFormValid = formData.title.trim() !== '' && (formData.content.trim() !== '' || formData.images.length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl"><Card><div className="max-h-[90vh] overflow-y-auto pr-2">
            <h2 className="text-xl font-bold bg-gold-text bg-clip-text text-transparent mb-6">{chapter ? 'Edit Chapter' : 'Add New Chapter'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-white font-medium mb-2">Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-islamic-gold-400" required /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-white font-medium mb-2">Language</label><select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value as 'english' | 'urdu' })} className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-islamic-gold-400"><option value="english">English</option><option value="urdu">Urdu</option></select></div>
                <div><label className="block text-white font-medium mb-2">Order</label><input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-islamic-gold-400" min="1" required /></div>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Chapter Images (Optional)</label>
                
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {imagePreviews.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg bg-black/20" />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          icon={Trash2} 
                          onClick={() => handleRemoveImage(index)} 
                          className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-white/20 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {uploading ? (
                      <Loader2 className="mx-auto h-12 w-12 text-islamic-gold-400 animate-spin" />
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-white/60" />
                    )}
                    <div className="flex text-sm text-white/60">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-islamic-blue-900 rounded-md font-medium text-islamic-gold-400 hover:text-islamic-gold-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-islamic-blue-900 focus-within:ring-islamic-gold-500">
                        <span>{uploading ? 'Uploading...' : 'Upload images'}</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          onChange={handleImageChange} 
                          accept="image/*" 
                          multiple
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-white/50">PNG, JPG, GIF (Multiple files supported)</p>
                  </div>
                </div>
              </div>

              <div><label className="block text-white font-medium mb-2">Text Content</label><textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full h-48 p-3 bg-white/10 border border-white/20 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-islamic-gold-400" placeholder="Enter text content. Optional if images are provided." /></div>
              <div className="flex items-center justify-end space-x-3">
                {!isFormValid && <p className="text-sm text-red-400 mr-auto">A title and content (text or images) are required.</p>}
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={!isFormValid || uploading}>{chapter ? 'Update' : 'Create'} Chapter</Button>
              </div>
            </form>
          </div></Card></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TestimonialManagement: React.FC = () => {
  const { testimonials, updateTestimonial, removeTestimonial } = useBook();

  const handleApprove = (id: string) => {
    updateTestimonial(id, { approved: true });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      removeTestimonial(id);
    }
  };

  const pendingTestimonials = testimonials.filter(t => !t.approved);
  const approvedTestimonials = testimonials.filter(t => t.approved);

  return (
    <>
      <Header title="Testimonial Management" showBack showHome />
      <div className="container mx-auto px-4 py-6">
        {/* Pending Testimonials */}
        <div className="mb-8">
          <h2 className="text-xl font-bold bg-gold-text bg-clip-text text-transparent mb-4">Pending Approval ({pendingTestimonials.length})</h2>
          {pendingTestimonials.length > 0 ? <div className="space-y-4">
            {pendingTestimonials.map((t) => (
              <Card key={t.id}><div className="flex items-start justify-between"><div className="flex-1"><div className="flex items-center mb-2"><h3 className="font-bold text-white mr-3">{t.name}</h3><div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-islamic-gold-400 fill-current' : 'text-white/30'}`} />))}</div></div><p className="text-white/80 mb-2 italic">"{t.text}"</p><p className="text-white/50 text-sm">{t.createdAt.toLocaleDateString()}</p></div><div className="flex items-center space-x-2 ml-4"><Button variant="ghost" size="sm" icon={Check} onClick={() => handleApprove(t.id)} className="text-green-400 hover:text-green-300" /><Button variant="ghost" size="sm" icon={X} onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300" /></div></div></Card>
            ))}
          </div> : <Card><p className="text-white/60 text-center py-4">No pending reviews.</p></Card>}
        </div>

        {/* Approved Testimonials */}
        <div>
          <h2 className="text-xl font-bold bg-gold-text bg-clip-text text-transparent mb-4">Approved Testimonials ({approvedTestimonials.length})</h2>
          {approvedTestimonials.length > 0 ? <div className="space-y-4">
            {approvedTestimonials.map((t) => (
              <Card key={t.id}><div className="flex items-start justify-between"><div className="flex-1"><div className="flex items-center mb-2"><h3 className="font-bold text-white mr-3">{t.name}</h3><div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-islamic-gold-400 fill-current' : 'text-white/30'}`} />))}</div></div><p className="text-white/80 mb-2 italic">"{t.text}"</p><p className="text-white/50 text-sm">{t.createdAt.toLocaleDateString()}</p></div><Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300" /></div></Card>
            ))}
          </div> : <Card><p className="text-white/60 text-center py-4">No approved testimonials yet.</p></Card>}
        </div>
      </div>
    </>
  );
};

export default AdminPortal;
