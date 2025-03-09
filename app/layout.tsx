import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photo search Gallery",
  description: "task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
