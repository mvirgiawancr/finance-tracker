import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monity - Finance Tracker AI",
  description: "Personal finance tracker with AI insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={plusJakartaSans.className + " antialiased min-h-screen bg-background"}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
