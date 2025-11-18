import ScraperPage from '../components/ScraperPage'
export default function Page() {
  return (
    <ScraperPage
      title="LinkedIn Profile Scraper"
      endpoint="/api/scrape/profile"
      fields={[{ name: 'url', label: 'Profile URL', placeholder: 'https://www.linkedin.com/in/...'}]}
    />
  )
}