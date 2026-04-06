"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import DocumentCard from "@/components/DocumentCard";
import { useEffect, useState } from "react";
import { documentsApi } from "@/lib/api/document";

export default function Home() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentsApi.getAll();
      setDocuments(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-900 selection:text-cyan-50">
  <Navbar />
  <main className="w-full  mx-auto px-4 pt-8  margin">
    
    <div className="flex justify-center items-center min-h-[12rem] text-center mb-16 margintop ambient-blue-cyan">
      <h1 className="font-extrabold text-5xl md:text-6xl text-slate-100 leading-tight tracking-tight">
        Upload and <br className="md:hidden" />
        <span className="text-cyan-400 margin">Research </span> 
        on <br className="md:hidden" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 margin text-6xl md:text-7xl drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          Documents 
        </span>
      </h1>
    </div>

    {loading && (
      <div className="flex justify-center items-center py-20">
        <div className="text-xl text-cyan-400 font-semibold animate-pulse flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Loading Documents...
        </div>
      </div>
    )}

    {error && (
      <div className="bg-red-950/40 border border-red-900 text-red-300 p-4 rounded-lg mb-8 shadow-lg flex items-center gap-3 max-w-2xl mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p><span className="font-bold text-red-400">Error:</span> {error}</p>
      </div>
    )}

    {!loading && documents.length === 0 && (
      <div className="text-center py-24 bg-slate-900/30 rounded-2xl border border-cyan-900/30 border-dashed max-w-3xl mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-cyan-900 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        <p className="text-2xl font-semibold text-cyan-100 mb-2">No documents found</p>
        <p className="text-cyan-600/70">Be the first to upload a document to the marketplace.</p>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {documents.map((doc)=>(
        <DocumentCard key={doc._id} document={doc}/>
      ))}
    </div>
  </main>
</div>
  );
}
