import Image from "next/image";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <HomePage />
        <footer className="bg-stone-950 text-stone-500 text-center text-sm py-8 mt-8">
          <p>© 2026 Bookify · ระบบจองที่พักออนไลน์</p>
        </footer>
      </div>
    </main>
  );
}
