'use client'

import DocumentCard from "@/components/DocumentCard";
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { documentsApi } from "@/lib/api/document";
import { useRouter } from "next/navigation";

export default function MyDocumentPage() {
  const [document, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    loadMyDocument();
  }, [user]);

  const loadMyDocument = async () => {
    try {
      const data = await documentsApi.getAll();
      console.log("raw data",data);
      const mydocs = data.filter((doc) => doc.creator_id === user.id);
      console.log("mydocs:", mydocs)
      const fetchedDocuments = data;
      setDocuments(mydocs);
      console.log( "documents:",fetchedDocuments)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-900 selection:text-cyan-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-cyan-900/50 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-300 tracking-tight">
            My Documents
          </h1>
          <button
            onClick={() => router.push('/documents/upload')}
            className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-500 font-semibold shadow-lg shadow-cyan-900/30 transition-all duration-300 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Upload New Document
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-xl text-cyan-400 font-semibold animate-pulse flex items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Your documents are loading...
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-950/40 border border-red-900 text-red-300 p-4 rounded-lg shadow-lg mb-8 flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
              {console.log(error)}
          </div>
        )}

        {!loading && document.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-slate-900/30 rounded-2xl border-2 border-dashed border-cyan-900/50 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-800 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xl text-slate-400 mb-6 font-medium">You haven't uploaded any documents yet.</p>
            <button
              onClick={() => router.push('/documents/upload')}
              className="bg-slate-800 text-cyan-300 border border-cyan-800 px-8 py-3 rounded-lg hover:bg-slate-700 hover:text-cyan-100 transition-all duration-300 font-bold shadow-lg"
            >
              Upload your first document
            </button>
          </div>
        )}

        {!loading && document.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {document.map((doc) => (
              <div key={doc._id} className="transition-transform duration-300 hover:-translate-y-1">
                <DocumentCard document={doc} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}