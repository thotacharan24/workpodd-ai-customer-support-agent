import "../styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "WorkPodd AI Refund Agent",
  description: "Customer support agent for e-commerce refund approvals with real-time reasoning and admin analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
