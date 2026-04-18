"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { purchasesApi } from "@/lib/api/purchases";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    router.push("/login");
    return null;
  }

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const data = await purchasesApi.getMyPurchases();
      const fetchedData = data.purchases;
      setPurchases(fetchedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-900 selection:text-cyan-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-cyan-300 tracking-tight">My Purchases</h1>
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-xl text-cyan-400 font-semibold animate-pulse">Loading your purchases...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-950/40 border border-red-900 text-red-300 p-4 rounded-lg mb-4">
            Error: {error}
          </div>
        )}

        {!loading && purchases.length === 0 && (
          <div className="text-center py-12 bg-slate-900 rounded-xl shadow-xl border border-cyan-900/30">
            <p className="text-xl text-slate-400 mb-4">
              You haven't purchased any documents yet.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-cyan-900/20 transition-all"
            >
              Browse Documents
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {purchases.map((purchase) => (
            <div
              key={purchase.document.id}
              className="bg-slate-900 rounded-xl shadow-xl shadow-cyan-900/10 border border-cyan-900/40 overflow-hidden hover:border-cyan-700/50 transition-all duration-300"
            >
              {console.log("purchases", purchase)}
              <div className="flex">
                <img
                  src={purchase.document.imageUrl}
                  alt={purchase.document.title}
                  className="w-48 h-48 object-cover border-r border-cyan-900/30"
                />

                <div className="flex-1 p-6 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-2 text-cyan-100">
                    {purchase.document.title}
                  </h3>
                  <p className="text-slate-400 mb-4 line-clamp-2">
                    {purchase.document.description}
                  </p>

                  <div className="flex justify-between items-center mt-auto">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">
                        Purchased on:{" "}
                        {new Date(purchase.purchasedAt).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                      <p className="text-xl font-bold text-cyan-400">
                        ₹{purchase.amount}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDownload(purchase.document.pdfUrl)}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center gap-2"
                    >
                       Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}