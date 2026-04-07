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
    const file = e.target.file[0];
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
    } catch (error) {
      setError(
        err.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Upload document</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-6"
        >
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g. , Complete Python program guide"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              rows="4"
              placeholder="Describe what your document contains..."
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g., 299"
              min="1"
              required
            />
          </div>
          <div>
               <label className="block text-gray-700 font-semibold mb-2">
              Cover Image * (JPG, PNG - Max 50MB)
               </label>
               <input 
               type="file"
               accept="image/jpeg,image/png,image/jpg"
               onChange={handleImageChange}
               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
               required
               />
               {imagePreview && (
                    <div className="mt-4">
                         <p className="text-sm text-gray-600 mb-2">Preview:</p>
                         <img src={imagePreview} alt="Preview" 
                         className="w-full h-48 object-cover rounded-lg"
                         />
                    </div>
               )}
          </div>
          <div>
          <label className="block text-gray-700 font-semibold mb-2">
              Pdf Document * (JPG, PNG - Max 50MB)
          </label>
          <input 
          type="file"
          accept="application/pdf"
          onChange={handlePdfchange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          required
          />
          {pdf && (
              <p className="text-sm text-green-600 mt-2">
                 Selected: {pdf.name} ({(pdf.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Uploading...' : 'Upload Document'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
