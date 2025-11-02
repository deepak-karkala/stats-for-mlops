import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DriftCity - Statistics for MLOps",
  description: "Interactive educational platform teaching statistical concepts in MLOps",
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
