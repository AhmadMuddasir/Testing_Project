"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { documentsApi } from "@/lib/api/document";

export default function DocumentDetailPage() {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    loadDocument();
  }, [params.id]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const data = await documentsApi.getbyId(params.id);
      const fetchedDocument = data.document;
      setDocument(fetchedDocument);
      console.log("document:",fetchedDocument);
    } catch (err) {
      setError(err.response?.data?.message || "failed to load document");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }
    try {
      setDeleting(true);
      await documentsApi.delete(params.id);
      router.push("/my-documents");
    } catch (error) {
      console.log(error);
      setDeleting(false);
    }
  };

  const handleBuy = () => {
    alert("Payment integration coming soon");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <Navbar />
        <div className="flex justify-center items-center py-32">
          <div className="text-xl text-cyan-400 font-semibold animate-pulse flex items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading document details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-950/40 border border-red-900 text-red-300 p-4 rounded-lg max-w-3xl mx-auto shadow-lg flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             {error}
          </div>
        </div>
      </div>
    );
  }

  if (!document) return null; // Safety check before rendering

  const isOwner = user && document.creator?.id === user.id;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-900 selection:text-cyan-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-xl shadow-lg shadow-cyan-900/20 border border-cyan-900/50 overflow-hidden">
          
          {/* Document Image */}
          <img 
            src={document.imageUrl} 
            alt={document.title} 
            className="w-full h-64 md:h-96 object-cover border-b border-cyan-900/50"
          />
          
          <div className="p-6 md:p-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-cyan-300 tracking-tight leading-tight">
                {document.title}
              </h1>
              <div className="shrink-0">
                <div className="text-2xl font-bold text-cyan-50 bg-cyan-950 px-5 py-2 rounded-lg border border-cyan-800 shadow-inner inline-block">
                  ₹{document.price}
                </div>
              </div>
            </div>

            {/* Author & Date Section */}
            <div className="mb-8 flex flex-col md:flex-row md:justify-between items-start md:items-center border-b border-cyan-900/50 pb-6 gap-2">
              <p className="text-lg text-slate-400">
               Created By <span className="text-cyan-400 font-semibold">{document.creator?.name || "Anonymous"}</span>
              </p>
              <p className="text-sm text-cyan-600/70 font-medium bg-slate-950 px-3 py-1 rounded-md border border-cyan-900/30">
                {new Date(document.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Description Section */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                Description
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/50 p-5 rounded-lg border border-cyan-900/30">
                {document.description}
              </p>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-cyan-900/50">
              {isOwner ? (
                <>
                  <button
                    onClick={() => router.push(`/documents/${params.id}/edit`)}
                    className="flex-1 bg-amber-600/20 text-amber-400 border border-amber-600/50 py-3.5 rounded-lg hover:bg-amber-600 hover:text-white transition-all duration-300 font-semibold shadow-lg"
                  >
                    Edit Document
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 bg-red-900/30 text-red-400 border border-red-900/50 py-3.5 rounded-lg hover:bg-red-800 hover:text-white transition-all duration-300 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? "Deleting..." : "Delete Document"}
                  </button>
                </>
              ) : (
                <>
                  {user ? (
                    <button
                      onClick={handleBuy}
                      className="flex-1 bg-cyan-600 text-white py-4 rounded-lg hover:bg-cyan-500 font-bold text-lg shadow-lg shadow-cyan-900/30 transition-all duration-300 border border-cyan-500 flex justify-center items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      Buy Now - ₹{document.price}
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push("/login")}
                      className="flex-1 bg-slate-800 text-cyan-300 border border-cyan-800 py-4 rounded-lg hover:bg-slate-700 hover:text-cyan-100 transition-all duration-300 font-bold text-lg flex justify-center items-center gap-2"
                    >
                      Login to Buy
                    </button>
                  )}
                </>
              )}
            </div>
            
            {/* Back Button */}
            <div className="mt-8 text-center">
                <button
                onClick={() => router.push("/")}
                className="text-cyan-600/80 hover:text-cyan-400 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Browse
                </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}