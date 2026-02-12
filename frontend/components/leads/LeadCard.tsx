"use client"

import { Building2, Mail, MapPin, Send, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getCSV } from "@/lib/api"


export default function LeadCard({ lead }: any) {
  if (!lead) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground">Select a lead to view details</p>
      </div>
    )
  }

  const initials = lead?.name
    .split(" ")
    .map((n: any) => n[0])
    .join("")
    .toUpperCase()

  return (
    <>
      <div className="w-full rounded-xl border border-border bg-card p-4 sm:p-5 flex flex-col">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
            <AvatarImage src={lead?.logo || undefined} />
            <AvatarFallback className="bg-muted text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex gap-1">
            {lead?.socials?.twitter && (
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <a
                  href={lead.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />

                  </svg>
                </a>
              </Button>
            )}

            {lead?.socials?.linkedin && (
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <a
                  href={lead.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />

                  </svg>
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Name & Website */}
        <h2 className="text-base sm:text-lg font-semibold truncate">
          {lead.name}
        </h2>

        {lead?.website && (
          <a
            href={lead.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 truncate block"
          >
            {lead.website}
          </a>
        )}

        <p className="mt-1 text-sm text-muted-foreground">
          {lead?.businessType}
        </p>

        {/* Company Info */}
        <div className="mt-3 space-y-2 rounded-lg border bg-muted/30 p-3 text-sm">
          {lead?.description && (
            <div className="flex gap-2 line-clamp-2">
              <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{lead.description}</span>
            </div>
          )}

          {lead?.email && (
            <div className="flex gap-2 truncate">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}

          {lead?.technologies && (
            <div className="flex gap-2 truncate">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{lead.technologies}</span>
            </div>
          )}
        </div>

        {/* Bio Preview */}
        {lead?.bio && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
            {lead.bio}
          </p>
        )}

        {/* See more */}
        <Link
          href={`/leads/${lead.id}`}
          onClick={() => localStorage.setItem("selectedLeadId", lead.id)}
          className="mt-2 text-sm font-medium text-primary underline underline-offset-2"
        >
          See more
        </Link>

        {/* Functional Areas */}
        {lead?.functionalAreas?.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Functional areas</p>
            <div className="flex flex-wrap gap-2">
              {lead.functionalAreas.slice(0, 4).map((area: any) => (
                <Badge
                  key={area}
                  variant="outline"
                  className="rounded-full px-3 py-1 text-xs"
                >
                  {area}
                </Badge>
              ))}

              {lead.functionalAreas.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{lead.functionalAreas.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <Button onClick={() => getCSV(lead?.jobId)} variant="outline" className="flex-1">
            Export CSV
            {/* <ChevronDown className="ml-2 h-4 w-4" /> */}
          </Button>

          <Button disabled={!lead.email} className="flex-1 ">
            <a
              href={`mailto:${lead?.email}`}

            >
              Send Email
            </a>
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
