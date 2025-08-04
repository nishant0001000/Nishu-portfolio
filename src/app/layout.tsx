import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import LenisProvider from '@/components/ui/lenis-provider'
import Navbar from '@/components/navbar/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Nishant Mogahaa - Full Stack Developer | AI Portfolio | Best Developer in India',
    template: '%s | Nishant Mogahaa - Full Stack Developer'
  },
  description: 'Nishant Mogahaa - Expert Full Stack Developer, AI Engineer, and IT Consultant. Specializing in React, Next.js, Node.js, AI/ML, and modern web technologies. Best developer for hire in India. Cybershoora IT Solutions.',
  keywords: [
    'Nishant Mogahaa',
    'Nishant Mogha',
    'Full Stack Developer',
    'React Developer',
    'Next.js Developer',
    'AI Engineer',
    'Machine Learning',
    'Web Development',
    'Mobile App Development',
    'IT Consultant',
    'Cybershoora',
    'Best Developer India',
    'Top Developer',
    'Expert Programmer',
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Node.js Developer',
    'Python Developer',
    'JavaScript Developer',
    'TypeScript Developer',
    'UI/UX Designer',
    'Database Developer',
    'API Developer',
    'Cloud Developer',
    'DevOps Engineer',
    'Freelance Developer',
    'Remote Developer',
    'Indian Developer',
    'Tech Consultant',
    'Digital Solutions'
  ],
  authors: [{ name: 'Nishant Mogahaa' }],
  creator: 'Nishant Mogahaa',
  publisher: 'Nishant Mogahaa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nishantportfolio.space'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nishantportfolio.space',
    title: 'Nishant Mogahaa - Full Stack Developer | AI Portfolio | Best Developer in India',
    description: 'Expert Full Stack Developer, AI Engineer, and IT Consultant. Specializing in React, Next.js, Node.js, AI/ML, and modern web technologies. Best developer for hire in India.',
    siteName: 'Nishant Mogahaa Portfolio',
    images: [
      {
        url: '/images/m-logo.svg',
        width: 1200,
        height: 630,
        alt: 'Nishant Mogahaa - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nishant Mogahaa - Full Stack Developer | AI Portfolio',
    description: 'Expert Full Stack Developer, AI Engineer, and IT Consultant. Best developer for hire in India.',
    images: ['/images/NISHANT.svg'],
    creator: '@nishant_mogahaa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  
    <html lang="en" suppressHydrationWarning>
             <head>
         {/* Google Analytics */}
         <script async src="https://www.googletagmanager.com/gtag/js?id=G-VR7LRE7T1S"></script>
         <script
           dangerouslySetInnerHTML={{
             __html: `
               window.dataLayer = window.dataLayer || [];
               function gtag(){dataLayer.push(arguments);}
               gtag('js', new Date());
               gtag('config', 'G-VR7LRE7T1S');
             `
           }}
         />
         
         {/* Structured Data for Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Nishant Mogahaa",
              "jobTitle": "Full Stack Developer",
              "description": "Expert Full Stack Developer, AI Engineer, and IT Consultant specializing in modern web technologies",
                             "url": "https://nishantportfolio.space",
               "image": "https://nishantportfolio.space/images/NISHANT.svg",
              "sameAs": [
                "https://github.com/nishant0001000",
                "https://linkedin.com/in/nishant-mogahaa",
                "https://instagram.com/nishant_mogahaa"
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "Cybershoora IT Solutions"
              },
              "knowsAbout": [
                "Full Stack Development",
                "React.js",
                "Next.js",
                "Node.js",
                "Python",
                "Machine Learning",
                "Artificial Intelligence",
                "Web Development",
                "Mobile App Development",
                "UI/UX Design"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "India"
              }
            })
          }}
        />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Cybershoora IT Solutions",
              "description": "Leading IT consultancy and development services company",
                             "url": "https://nishantportfolio.space",
               "logo": "https://nishantportfolio.space/images/NISHANT.svg",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "rajputvashu429@gmail.com"
              },
              "sameAs": [
                "https://instagram.com/nishant_mogahaa"
              ]
            })
          }}
        />

        {/* Structured Data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Nishant Mogahaa Portfolio",
                             "url": "https://nishantportfolio.space",
               "description": "Professional portfolio of Nishant Mogahaa - Full Stack Developer and AI Engineer",
               "author": {
                 "@type": "Person",
                 "name": "Nishant Mogahaa"
               },
               "potentialAction": {
                 "@type": "SearchAction",
                 "target": "https://nishantportfolio.space/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* Additional SEO Meta Tags */}
        <meta name="author" content="Nishant Mogahaa" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Nishant Mogahaa - Full Stack Developer",
              "description": "Expert Full Stack Developer and AI Engineer providing web development, mobile app development, and IT consultancy services",
                             "url": "https://nishantportfolio.space",
              "telephone": "+91-9870691784",
              "email": "rajputvashu429@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "India"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "20.5937",
                "longitude": "78.9629"
              },
              "openingHours": "Mo-Su 09:00-18:00",
              "priceRange": "$$",
              "serviceArea": {
                "@type": "Country",
                "name": "India"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Development Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Full Stack Web Development",
                      "description": "Complete web application development using React, Next.js, Node.js"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "AI/ML Development",
                      "description": "Machine learning and artificial intelligence solutions"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Mobile App Development",
                      "description": "Cross-platform mobile application development"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LenisProvider>
            <Navbar />
            {children}
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
