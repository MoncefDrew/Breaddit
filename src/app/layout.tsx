import Navbar from '@/components/Navbar'
import { cn } from '@/lib/utils'
import { IBM_Plex_Sans } from 'next/font/google'
import { Toaster } from '../components/ui/toaster'
import '@/styles/globals.css'
import Providers from '@/components/Providers'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Breadit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html
    lang='en'
    className={cn(
      'bg-[#1A1A1B] text-gray-200 antialiased dark',
      inter.className
    )}>
      <body className='min-h-screen bg-[#030303] antialiased'>
        <Providers>
          {/*@ts-expect-error server component*/}
          <Navbar />
          {authModal}
          <div className='w-full max-w-7xl mx-auto h-full pt-6 md:pt-12  md:px-6'>
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}