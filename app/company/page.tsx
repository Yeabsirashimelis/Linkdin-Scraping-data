import ScraperPage from '../components/ScraperPage'
export default function Page() {
  return (
    <ScraperPage
      title="LinkedIn Company Scraper"
      endpoint="/api/scrape/company"
      fields={[{ name: 'url', label: 'Company URL', placeholder: 'https://www.linkedin.com/company/...'}]}
    />
  )
}