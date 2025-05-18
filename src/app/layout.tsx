import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SolanaWalletProvider } from "@/components/providers/WalletProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "MedX",
  description: "Your personal healthcare assistant",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex items-center justify-center bg-gray-100 min-h-screen`}
      >
        <div className="w-[430px] h-[600px] bg-white shadow-lg overflow-auto rounded-xl">
          <SolanaWalletProvider>{children}</SolanaWalletProvider>
        </div>
      </body>
    </html>
  )
}
