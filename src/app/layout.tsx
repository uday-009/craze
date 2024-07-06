import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StateProvider from "@/context/StateProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cash Craze Game",
  description: "Cash Craze Game for Lottery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StateProvider>
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        {children}</body>
    </html>
    </StateProvider>
  );
}
