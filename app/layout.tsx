import type { Metadata } from "next";
import { TwoColumnShell } from "@/components/layout/TwoColumnShell";
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
      <body>
        <TwoColumnShell>{children}</TwoColumnShell>
      </body>
    </html>
  );
}
