import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import {
  ChevronRight,
  CheckCircle2,
  Clock,
  Star,
  TrendingUp,
  Home as HomeIcon,
  Building2,
  MapPin,
} from 'lucide-react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LeadModal from '@/components/LeadModal'
import OpenModalButton from '@/components/OpenModalButton'
import { services } from '@/lib/services-data'
import { locations } from '@/lib/locations-data'

type Props = { params: { service: string; location: string } }

const stripServicesSuffix = (name: string) => name.replace(/\s+Services$/i, '').trim()

// Deterministic hash for stable headline variant
const hashString = (input: string) => {
  let h = 5381
  for (let i = 0; i < input.length; i++) h = (h * 33) ^ input.charCodeAt(i)
  return Math.abs(h)
}

const headlineVariantsFor = (serviceSlug: string, serviceName: string) => {
  const noun = stripServicesSuffix(serviceName)

  const base = [
    `Find ${noun} in {location}`,
    `Get Matched with ${noun} in {location}`,
    `${noun} in {location} - Fast Matching`,
  ]

  const variants: Record<string, string[]> = {
    'moving-companies': [
      `Find Moving Companies in {location}`,
      `Get Matched with Movers in {location}`,
      `Moving Companies in {location} - Fast Matching`,
    ],
    'real-estate-agents': [
      `Find Real Estate Agents in {location}`,
      `Get Matched with Top Agents in {location}`,
      `Real Estate Agents in {location} - Free Service`,
    ],
  }

  return variants[serviceSlug] || base
}

const pickHeadline = (serviceSlug: string, serviceName: string, locationSlug: string) => {
  const options = headlineVariantsFor(serviceSlug, serviceName)
  const idx = hashString(serviceSlug + locationSlug) % options.length
  return options[idx]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = services[params.service]
  const location = locations[params.location]
  if (!service || !location) return { title: 'Not Found' }

  const noun = stripServicesSuffix(service.name)
  const headline = pickHeadline(params.service, service.name, params.location).replace('{location}', location.name)

  return {
    title: `${headline} | Building Health X`,
    description: `Get matched with top ${noun.toLowerCase()} professionals in ${location.name}. Free service, fast matching, no commitment required.`,
  }
}

export default function ServiceLocationPage({ params }: Props) {
  const service = services[params.service]
  const location = locations[params.location]

  if (!service || !location) notFound()

  const noun = stripServicesSuffix(service.name)
  const headline = pickHeadline(params.service, service.name, params.location).replace('{location}', location.name)

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      <Header />
      
      <main className="pt-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-emerald-600/5 to-purple-600/10"></div>
          
          <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/services" className="hover:text-white transition">Services</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{location.name}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Hero Content */}
              <div className="animate-slide-in">
                {/* Pre-headline */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
                  <MapPin className="w-4 h-4" />
                  Serving {location.name}
                </div>

                {/* Main Headline */}
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  {headline.split(location.name)[0]}
                  <span className="gradient-text">{location.name}</span>
                  {headline.split(location.name)[1]}
                </h1>

                {/* Subheadline */}
                <p className="text-xl text-slate-300 mb-8">
                  Get matched with experienced {noun.toLowerCase()} professionals. Free service, fast matching, no commitment required.
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    Matched in minutes
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    </div>
                    Verified providers
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    </div>
                    100% free service
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <OpenModalButton variant="primary" className="text-base">
                    Get Matched Now
                  </OpenModalButton>
                  <Link 
                    href="#how-it-works"
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition text-center"
                  >
                    See How It Works
                  </Link>
                </div>

                {/* Recent activity ticker */}
                <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    Recent matches in {location.name}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-slate-300">
                      <span className="text-emerald-400">8 mins ago</span> - Matched with {noun.toLowerCase()}
                    </div>
                    <div className="text-sm text-slate-300">
                      <span className="text-emerald-400">24 mins ago</span> - Request completed
                    </div>
                    <div className="text-sm text-slate-300">
                      <span className="text-emerald-400">1 hour ago</span> - New match made
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Hero Image */}
              <div className="relative animate-slide-in lg:block hidden" style={{animationDelay: '0.2s'}}>
                <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <Image
                    src={`/services/${params.service}.png`}
                    alt={`${noun} in ${location.name}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/60 to-transparent"></div>
                  
                  {/* Rating badge on image */}
                  <div className="absolute top-6 left-6 bg-[#151c2c]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-lg font-bold">4.8/5</span>
                    </div>
                    <p className="text-xs text-slate-400">From 342 matches</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF BAR */}
        <section className="border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img src="https://i.pravatar.cc/150?img=12" alt="User" className="w-10 h-10 rounded-full border-2 border-[#0a0e17]" />
                  <img src="https://i.pravatar.cc/150?img=32" alt="User" className="w-10 h-10 rounded-full border-2 border-[#0a0e17]" />
                  <img src="https://i.pravatar.cc/150?img=45" alt="User" className="w-10 h-10 rounded-full border-2 border-[#0a0e17]" />
                  <img src="https://i.pravatar.cc/150?img=68" alt="User" className="w-10 h-10 rounded-full border-2 border-[#0a0e17]" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-white">180+ successful matches</div>
                  <div className="text-slate-400">in {location.name} this month</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <div className="font-semibold text-white">4.8/5</div>
                  <div className="text-slate-400">Average rating</div>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div>
                  <div className="font-semibold text-white">2 hours</div>
                  <div className="text-slate-400">Avg. match time</div>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div>
                  <div className="font-semibold text-white">100%</div>
                  <div className="text-slate-400">Free service</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-slate-400">Get matched in 3 simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative p-8 bg-[#151c2c] border border-[#1e293b] rounded-2xl hover:transform hover:scale-105 transition-transform duration-300">
                <div className="absolute -top-4 left-8 w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="mb-4 w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Tell Us What You Need</h3>
                <p className="text-slate-400">
                  Share your requirements and we'll match you with the right professionals. Takes 2 minutes.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative p-8 bg-[#151c2c] border border-[#1e293b] rounded-2xl hover:transform hover:scale-105 transition-transform duration-300">
                <div className="absolute -top-4 left-8 w-8 h-8 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="mb-4 w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">We Match You with Pros</h3>
                <p className="text-slate-400">
                  Our system connects you with experienced {location.name} professionals who fit your needs.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative p-8 bg-[#151c2c] border border-[#1e293b] rounded-2xl hover:transform hover:scale-105 transition-transform duration-300">
                <div className="absolute -top-4 left-8 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="mb-4 w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Get Started</h3>
                <p className="text-slate-400">
                  Providers reach out within hours. Choose who you want to work with. No obligation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">What People Say</h2>
              <p className="text-xl text-slate-400">Real feedback from {location.name} residents</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 bg-[#151c2c] border border-[#1e293b] rounded-2xl hover:transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4">
                    "Got matched within an hour. Found the perfect provider through them. The service is completely free which is amazing."
                  </p>
                  <div className="flex items-center gap-3">
                    <img src={`https://i.pravatar.cc/150?img=${30 + i}`} alt="User" className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-semibold text-sm">User {i}</div>
                      <div className="text-xs text-slate-400">{location.name} • 2 weeks ago</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-600/10 via-emerald-600/5 to-purple-600/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Get matched with top {location.name} professionals. Free service, no commitment.
            </p>
            <OpenModalButton variant="primary" className="text-lg px-10 py-5">
              Get Matched Now
            </OpenModalButton>
            <p className="text-sm text-slate-400 mt-6">
              <CheckCircle2 className="inline-block w-4 h-4 mr-1 text-emerald-400" />
              Free to use • No commitment • Avg. response: 2 hours
            </p>
          </div>
        </section>
      </main>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17] to-transparent z-40 pointer-events-none">
        <OpenModalButton className="w-full pointer-events-auto" variant="primary">
          Get Matched Now
        </OpenModalButton>
      </div>

      <Footer />

      {/* Lead Modal */}
      <LeadModal
        serviceType={service.name}
        serviceSlug={params.service}
        location={location.name}
        locationSlug={params.location}
      />
    </div>
  )
}
