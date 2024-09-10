"use client"; // Đánh dấu đây là Client Component

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientRootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header luôn hiển thị */}
      <Header />
      
      {/* Nội dung chính */}
      <main className="flex-grow bg-white bg-opacity-90">
        {children}
      </main>
      
      {/* Footer luôn hiển thị */}
      <Footer />
    </div>
  );
}
