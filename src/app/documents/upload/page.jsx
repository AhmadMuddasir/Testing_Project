"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { documentsApi } from "@/lib/api/document";

export default function UploadDocumentPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdf(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !price || !image || !pdf) {
      setError("All fields are required");
      return;
    }

    if (parseFloat(price) <= 0) {
      setError("Price must be greater then 0");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("image", image);
      formData.append("pdf", pdf);

      await documentsApi.upload(formData);
      router.push("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-900 selection:text-cyan-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-cyan-300 tracking-tight">Upload document</h1>
        {error && (
          <div className="bg-red-950/40 border border-red-900 text-red-300 px-4 py-3 rounded-lg mb-6 shadow-lg">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-8 rounded-xl shadow-lg shadow-cyan-900/20 border border-cyan-900/50 space-y-6"
        >
          <div>
            <label className="block text-cyan-400 font-semibold mb-2">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-cyan-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              placeholder="e.g. , Complete Python program guide"
              required
            />
          </div>
          <div>
            <label className="block text-cyan-400 font-semibold mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-cyan-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              rows="4"
              placeholder="Describe what your document contains..."
              required
            />
          </div>
          <div>
            <label className="block text-cyan-400 font-semibold mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-cyan-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              placeholder="e.g., 299"
              min="1"
              required
            />
          </div>
          <div>
               <label className="block text-cyan-400 font-semibold mb-2">
              Cover Image * (JPG, PNG - Max 50MB)
               </label>
               <input 
               type="file"
               accept="image/jpeg,image/png,image/jpg"
               onChange={handleImageChange}
               className="w-full px-4 py-3 bg-slate-950 border border-cyan-800 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-900 file:text-cyan-300 hover:file:bg-cyan-800 transition-colors"
               required
               />
               {imagePreview && (
                    <div className="mt-4 p-2 bg-slate-950 rounded-lg border border-cyan-900/50">
                         <p className="text-sm text-cyan-600 mb-2 font-medium">Preview:</p>
                         <img src={imagePreview} alt="Preview" 
                         className="w-full h-48 object-cover rounded-md opacity-90 hover:opacity-100 transition-opacity"
                         />
                    </div>
               )}
          </div>
          <div>
          <label className="block text-cyan-400 font-semibold mb-2">
              Pdf Document * (JPG, PNG - Max 50MB)
          </label>
          <input 
          type="file"
          accept="application/pdf"
          onChange={handlePdfchange}
          className="w-full px-4 py-3 bg-slate-950 border border-cyan-800 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-900 file:text-cyan-300 hover:file:bg-cyan-800 transition-colors"
          required
          />
          {pdf && (
              <p className="text-sm text-emerald-400 mt-3 font-medium bg-emerald-950/30 p-2 rounded border border-emerald-900/50">
                 Selected: {pdf.name} ({(pdf.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          <div className="flex gap-4 pt-4 border-t border-cyan-900/50">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-cyan-900/30 transition-all duration-300"
            >
              {loading ? 'Uploading...' : 'Upload Document'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-8 bg-slate-800 text-slate-300 py-3 rounded-lg hover:bg-slate-700 hover:text-white border border-slate-700 transition-all duration-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}