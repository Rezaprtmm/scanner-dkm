import "./globals.css"

// Function
import { Poppins as FontSans } from "next/font/google"

// Constants
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: "400",
})

export const metadata = {
  title: "Scanner DKM",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={fontSans.className}>{children}</body>
    </html>
  )
}
