import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    template: '%s | Youth Development Program (YDP)',
    default: 'Youth Development Program (YDP)',
  },
  description: 'The Youth Development Program (YDP) is a national initiative dedicated to empowering the youth of Pakistan through education, leadership, and skill development.',
  keywords: ['YDP', 'Youth Development Program', 'Pakistan', 'Youth', 'Empowerment', 'Education', 'Leadership'],
  openGraph: {
    title: 'Youth Development Program (YDP)',
    description: 'Empowering the youth of Pakistan through education, leadership, and skill development.',
    url: 'https://ydp.org.pk',
    siteName: 'Youth Development Program (YDP)',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Youth Development Program (YDP)',
    description: 'Empowering the youth of Pakistan.',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ydp.org.pk',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Youth Development Program (YDP)",
    "url": "https://ydp.org.pk",
    "logo": "https://ydp.org.pk/images/gallery/ydp-logo.jpg",
    "description": "Empowering the youth of Pakistan through education, leadership, and skill development.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+92 311 9250771",
      "contactType": "customer service",
      "email": "infoyda2024@gmail.com"
    },
    "sameAs": [
      "https://www.facebook.com/YDP",
      "https://twitter.com/YDP",
      "https://www.instagram.com/YDP",
      "https://www.youtube.com/YDP"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
