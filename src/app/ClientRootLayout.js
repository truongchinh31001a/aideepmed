"use client"; // Đây là Client Component

import { usePathname } from "next/navigation";
import Header from "../components/Header"; // Import Header (Client Component)
import Footer from "../components/Footer";
import { ReactNotifications } from "react-notifications-component";
import 'react-notifications-component/dist/theme.css';

export default function ClientRootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");
  const isDashBoardPage = pathname.startsWith("/dashboard")

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && !isDashBoardPage && <Header />}
      <ReactNotifications/>


      <main className="flex-grow bg-white bg-opacity-90">
        {children}
      </main>

      {!isAuthPage && !isDashBoardPage && <Footer />}
    </div>
  );
}
