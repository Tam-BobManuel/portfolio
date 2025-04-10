import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import LayoutProvider from "@/components/layout/LayoutLoading";
import NavBar from "@/components/NavBar";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Tam's website",
    default: "Tam's website",
  },
  description:
    "This is the personal website of Tam, an economist and programmer.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} antialiased`}>
        <LayoutProvider>
          <NavBar />
          <main className="pt-20">{children}</main>
        </LayoutProvider>
      </body>
    </html>
  );
}
