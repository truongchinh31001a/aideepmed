"use client"; // Đánh dấu đây là Client Component

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation"; // Để lấy đường dẫn hiện tại

export default function ClientRootLayout({ children }) {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  // Kiểm tra nếu đang ở trang auth
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hiển thị Header và Footer nếu không phải là trang auth */}
      {!isAuthPage && <Header />}
      
      {/* Nội dung chính */}
      <main className="flex-grow bg-white bg-opacity-90">
        {children}
      </main>
      
      {/* Hiển thị Footer nếu không phải là trang auth */}
      {!isAuthPage && <Footer />}
    </div>
  );
}
