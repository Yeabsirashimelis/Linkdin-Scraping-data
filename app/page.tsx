'use client'
import Link from 'next/link'
export default function Page() {
  return (
    <div>
      <p>Select a scraper:</p>
      <ul style={{ lineHeight: '2.2em' }}>
        <li><Link href="/search">🔍 LinkedIn Search Scraper</Link></li>
        <li><Link href="/job">💼 LinkedIn Job Scraper</Link></li>
        <li><Link href="/company">🏢 LinkedIn Company Scraper</Link></li>
        <li><Link href="/profile">👤 LinkedIn Profile Scraper</Link></li>
      </ul>
    </div>
  )
}