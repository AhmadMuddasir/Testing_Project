"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import img from "./x.png";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-cyan-950  text-white shadow-md">
      <div className="container  mx-auto px-4 py-2 flex  justify-between items-center">
        <Link href="/" className="text-2xl flex font-bold items-center gap-2">
          Document Marketplace
          <Image
            src={img}
            alt="Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
        </Link>

        <div className="flex items-center text-xl font-semibold gap-6">
          <Link href="/" className="hover:underline">
            Browse
          </Link>

          {user ? (
            <>
              <Link href="/documents/upload" className="hover:underline">
                Upload
              </Link>
              <Link href="/my-documents" className="hover:underline">
                My Documents
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm">Hello, {user.name}</span>
                <button
                  onClick={logout}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/register" className=" px-4 py-2 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
