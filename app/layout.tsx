import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import {
  NOTEHUB_APP_DESCRIPTION,
  NOTEHUB_APP_NAME,
  NOTEHUB_OG_IMAGE,
} from "@/lib/metadata";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: NOTEHUB_APP_NAME,
  description: NOTEHUB_APP_DESCRIPTION,
  openGraph: {
    title: NOTEHUB_APP_NAME,
    description:
      NOTEHUB_APP_DESCRIPTION,
    url: "/",
    images: [NOTEHUB_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${roboto.className}`}
      >
        <TanStackProvider>
          <AuthProvider>
            <div className="app-wrapper">
              <Header />
              <main className="main-content">
                {children}
              </main>
              {modal}
              <Footer />
            </div>
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
