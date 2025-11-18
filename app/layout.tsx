import './globals.css'

export const metadata = {
  title: 'HireCards — Apify Demo',
  description: 'Demo app showing Apify LinkedIn scrapers integrated with Next.js'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
          <h1>HireCards — Apify Scraper Demo</h1>
          {children}
        </main>
      </body>
    </html>
  )
}