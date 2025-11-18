import ScraperPage from '../components/ScraperPage'
export default function Page() {
  return (
    <ScraperPage
      title="LinkedIn Job Scraper"
      endpoint="/api/scrape/job"
      fields={[{ name: 'url', label: 'Job URL', placeholder: 'https://www.linkedin.com/jobs/view/...'}]}
    />
  )
}