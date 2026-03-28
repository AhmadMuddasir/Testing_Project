import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "Document MarketPLace",
  description: "Buy and sell PDF documents",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
