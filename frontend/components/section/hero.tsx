import Image from "next/image";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section className="relative h-[200vh] overflow-hidden text-white">

      {/* Video */}
      <Image
        src="/hero.png"
        alt="hero image"
        fill
        className="object-cover opacity-20"
        priority
      />


      <div className="absolute inset-0 bg-black/50" />

      <div className="relative gap-4 z-10 max-w-7xl mx-auto px-6 h-full flex justify-center items-center flex-col">

        <h1 className="md:text-5xl font-bold">
          Web Scraping Meets Lead Intelligence
        </h1>
        <p className="max-w-3xl text-center">Automatically collect business data, contacts, and insights from any website. Use the dashboard or integrate via API — built for modern SaaS and developers.</p>

        <div className="flex gap-2 mt-8">
          <Button >Get Started Now</Button>
          <Button className="text-black" variant={'outline'}>Book Demo</Button>

        </div>

      </div>
    </section>
  );
}