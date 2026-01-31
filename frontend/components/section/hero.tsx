'use client'
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from 'next/navigation';


export default function Hero() {
  const router = useRouter();
  return (
    <section className="relative h-[200vh] overflow-hidden text-white">

      {/* Video */}
      <Image
        src="/hero.png"
        alt="hero image"
        fill
        className="object-cover opacity-30"
        priority
      />


      <div className="absolute inset-0 bg-black/50" />

      <div className="relative gap-4 z-10 max-w-5xl mx-auto px-6 h-full flex justify-center items-center flex-col">

        <h1 className="md:text-5xl text-center font-bold max-w-2xl">
         When Web Scraping Meets Lead Intelligence
        </h1>
        <p className="max-w-2xl text-center">Automatically collect business data, contacts, and insights from any website. Use the dashboard or integrate via API — built for modern SaaS and developers.</p>

        <div className="flex gap-2 mt-8">
          <Button className="bg-yellow-300 hover:bg-amber-200 text-black" onClick={()=>router.push('/auth')}>Get Started Now</Button>

        </div>

      </div>
    </section>
  );
}