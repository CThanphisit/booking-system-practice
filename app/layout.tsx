import type { Metadata } from "next";
import { Mitr } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";

const mitr = Mitr({
  variable: "--font-mitr",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "StayEase",
  description: "Book your perfect stay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mitr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
