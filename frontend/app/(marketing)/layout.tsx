import { ReactNode } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Header";

export default function MarketingLayout({ children }:{children:ReactNode}) {
  // #0B0C26
  return (
    <><div className="bg-[#0b0f2a] selection:bg-yellow-300 selection:text-black">
      <header><Navbar /></header>
      <main>{children}</main>
      <footer><Footer /></footer>
      </div>
    </>
  )
}