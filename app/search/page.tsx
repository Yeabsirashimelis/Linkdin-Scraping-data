import ScraperPage from '../components/ScraperPage'
export default function Page() {
  return (
    <ScraperPage
      title="LinkedIn Search Scraper"
      endpoint="/api/scrape/search"
      fields={[{ name: 'query', label: 'Search Query', placeholder: 'e.g. Senior Backend Engineer Amsterdam' }]}
    />
  )
}