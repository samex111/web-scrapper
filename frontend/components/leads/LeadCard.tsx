"use client"

import { Building2, Mail, MapPin, Send, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"


export default function LeadCard({ lead }: any) {
  if (!lead) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground">Select a lead to view details</p>
      </div>
    )
  }

  const initials = lead.name
    .split(" ")
    .map((n:any) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="rounded-xl max-w-sm border border-border bg-card p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <Avatar className="h-16 w-16">
          <AvatarImage src={lead.logo} />
          <AvatarFallback className="bg-muted text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Name and Title */}
      <h2 className="text-xl font-semibold">{lead.name}</h2>
      <a href={lead?.website} className="text-sm font-medium text-blue-400">{lead?.website}</a>
      <p className="mt-1 text-sm text-muted-foreground">{lead?.businessType}</p>

      {/* Company Info */}
      <div className="mt-4 space-y-2 rounded-lg border border-border bg-muted/30 p-3">
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span>{lead?.description}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{lead.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{lead?.technologies}</span>
        </div>
      </div>

      {/* Bio */}
      <p className="mt-4 text-sm text-muted-foreground">
        {lead.bio}{" "}
        <button className="font-medium text-foreground underline underline-offset-2">
          See more
        </button>
      </p>

      {/* Functional Areas */}
      <div className="mt-4">
        <p className="mb-2 text-sm font-medium">Functional area</p>
        <div className="flex flex-wrap gap-2">
          {lead.functionalAreas?.map((area:any) => (
            <Badge
              key={area}
              variant="outline"
              className="rounded-full border-border bg-card px-3 py-1 text-xs font-normal"
            >
              {area}
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <Button variant="outline" className="flex-1 bg-transparent">
          Export PDF
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          Email
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
