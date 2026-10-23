import type { Metadata } from "next";
import { AppProvider } from "@/provider/app-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Submitly — A little progress, every assignment.",
    template: "%s · Submitly",
  },
  description:
    "Your workspace for assignments, thoughtful feedback, and steady progress.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
