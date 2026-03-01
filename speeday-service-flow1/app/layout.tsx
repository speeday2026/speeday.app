import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Speeday - Entrega de Volumosos no Mesmo Dia',
  description: 'Infraestrutura de velocidade e conveniência logística para o varejo de volumosos. Recolha e entrega no mesmo dia.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
