'use client'

import { useState } from "react"
import { publicScraper } from "@/lib/api"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import LeadDetail from "../leads/SingleLead"
import { ScrapedLead } from "@/types/publicTypes"

export default function GetData() {

  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [lead, setLead] = useState<ScrapedLead | null>(null)

  async function handleScrape() {
    try {
      setLoading(true)

      const res = await publicScraper(url)

      const firstLead = res.data[0]?.data
      setLead(firstLead)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl space-y-4">

      <div className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter url to scrape"
          className="bg-[#252525] border-gray-700 text-white placeholder:text-gray-500"
        />

        <Button onClick={handleScrape} disabled={loading}>
          {loading ? "Scraping..." : "Scrape"}
        </Button>
      </div>

      {lead && <LeadDetail lead={lead} />}

    </div>
  )
}