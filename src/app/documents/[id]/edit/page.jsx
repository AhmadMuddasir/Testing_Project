'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { documentsApi } from '@/lib/api/document';

export default function EditDocumentPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
      return;
    }

    const loadDocument = async () => {
      try {
        setLoading(true);
        const data = await documentsApi.getbyId(params.id);
        const doc = data.document;

        if (doc.creator?.id !== user.id) {
          router.push('/');
          return;
        }

        setTitle(doc.title);
        setDescription(doc.description);
        setPrice(doc.price.toString());
        setCurrentImageUrl(doc.imageUrl || ''); 
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDocument();
    }
  }, [user, params.id, router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) setPdf(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !price) {
      setError('Title, description, and price are required');
      return;
    }

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      if (image) formData.append('image', image);
      if (pdf) formData.append('pdf', pdf);

      await documentsApi.update(params.id, formData);
      router.push(`/documents/${params.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <Navbar />
        <div className="flex justify-center items-center py-32">
          <div className="text-xl text-cyan-400 font-semibold animate-pulse flex items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-cyan-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-900 selection:text-cyan-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-cyan-300 tracking-tight">Edit Document</h1>

        {error && (
          <div className="bg-red-950/40 border border-red-900 text-red-300 p-4 rounded-lg mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-xl shadow-xl shadow-cyan-900/10 border border-cyan-900/40 space-y-6">
          <div>
            <label className="block text-cyan-400 font-medium mb-2">Document Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-900/50 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-cyan-400 font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-900/50 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              rows="5"
              required
            />
          </div>

          <div>
            <label className="block text-cyan-400 font-medium mb-2">Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-900/50 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              min="1"
              required
            />
          </div>

          <div className="pt-4 border-t border-cyan-900/30">
            <label className="block text-cyan-400 font-medium mb-3">Cover Image</label>
            <div className="mb-4 relative group">
              {(imagePreview || currentImageUrl) ? (
                <img
                  src={imagePreview || currentImageUrl || null}
                  alt="Preview"
                  className="w-full h-44 object-cover rounded-lg border border-cyan-900/50 opacity-80 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="w-full h-44 rounded-lg border border-dashed border-cyan-900/50 flex items-center justify-center bg-slate-950 text-slate-500">
                  No image available
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-950 file:text-cyan-400 hover:file:bg-cyan-900 transition-all cursor-pointer"
            />
          </div>

          <div className="pt-4 border-t border-cyan-900/30">
            <label className="block text-cyan-400 font-medium mb-2">Update PDF (Optional)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-950 file:text-cyan-400 hover:file:bg-cyan-900 transition-all cursor-pointer"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={updating}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-cyan-900/20 transition-all disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Update Document'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/documents/${params.id}`)}
              className="px-8 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3.5 rounded-lg font-semibold border border-slate-700 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}