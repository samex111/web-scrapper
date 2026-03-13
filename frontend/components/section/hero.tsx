'use client'

import Image from "next/image"
import { Button } from "../ui/button"
import Link from "next/link"
import GetData from "./getData"

export default function Hero() {

  return (
    <section className="relative min-h-screen overflow-hidden text-white">

      <Image
        src="/hero.png"
        alt="hero image"
        fill
        sizes="100vw"
        className="object-cover opacity-30"
        priority
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 min-h-screen flex flex-col justify-center items-center gap-6">

        <h1 className="text-center md:text-5xl text-3xl font-bold max-w-2xl">
          When Web Scraping Meets Lead Intelligence
        </h1>

        <p className="max-w-2xl text-center text-gray-300">
          Automatically collect business data, contacts, and insights from any website.
          Use the dashboard or integrate via API — built for modern SaaS and developers.
        </p>

        <div className="flex gap-2 mt-4">
          <Link href="/auth">
            <Button className="bg-yellow-300 hover:bg-amber-200 text-black">
              Get Started Now
            </Button>
          </Link>
        </div>

        <div className="mt-10 w-full max-w-xl">
          <GetData />
        </div>

      </div>
    </section>
  )
}