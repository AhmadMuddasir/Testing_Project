"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import img from "./x.png";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="padding sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-cyan-900/40 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src={img}
            alt="Logo"
            width={40}
            height={40}
            className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
          />
          <span className="text-2xl font-extrabold  text-white">
            Document Marketplace
          </span>
        </Link>

        <div className="flex items-center text-lg font-medium gap-6">
          <Link href="/" className="text-slate-300 hover:text-cyan-400 transition-colors">
            Browse
          </Link>

          {user ? (
            <>
              <Link href="/documents/upload" className="text-slate-300 hover:text-cyan-400 transition-colors">
                Upload
              </Link>
              <Link href="/my-documents" className="text-slate-300 hover:text-cyan-400 transition-colors">
                My Documents
              </Link>
              <Link href="/purchases" className="text-slate-300 hover:text-cyan-400 transition-colors">
                My Purchases
              </Link>
              
              <div className="flex items-center gap-4 pl-4 border-l border-cyan-900/40 ml-2">
                <span className="text-cyan-100/70">
                  Hello, <span className="text-cyan-300 font-semibold">{user.name}</span>
                </span>
                <button
                  onClick={logout}
                  className="bg-slate-900 border border-slate-700 text-red-400 px-4 py-1.5 rounded-lg hover:bg-slate-800 hover:border-red-900/50 hover:text-red-300 transition-all text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4 pl-4 border-l border-cyan-900/40 ml-2">
              <Link href="/login" className="text-slate-300 hover:text-cyan-400 transition-colors">
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-lg shadow-lg shadow-cyan-900/20 transition-all font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}