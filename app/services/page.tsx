import Link from 'next/link'
import { ChevronRight, Truck, Package, Archive, Trash2, Sparkles, ClipboardCheck, Shield, Wifi, Key, Wrench, PaintBucket, Bug, Thermometer, Droplets, Zap, AlertOctagon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { services } from '@/lib/services-data'
import Image from 'next/image'


const getServiceIcon = (slug: string, size: string = 'w-5 h-5') => {
  const icons: Record<string, React.ReactNode> = {
    'moving-companies': <Truck className={size} />,
    'packing-services': <Package className={size} />,
    'storage-facilities': <Archive className={size} />,
    'junk-removal': <Trash2 className={size} />,
    'cleaning-services': <Sparkles className={size} />,
    'building-inspectors': <ClipboardCheck className={size} />,
    'renters-insurance': <Shield className={size} />,
    'internet-providers': <Wifi className={size} />,
    locksmith: <Key className={size} />,
    'furniture-assembly': <Wrench className={size} />,
    painters: <PaintBucket className={size} />,
    'pest-control': <Bug className={size} />,
    'hvac-repair': <Thermometer className={size} />,
    plumbers: <Droplets className={size} />,
    electricians: <Zap className={size} />,
    'mold-remediation': <AlertOctagon className={size} />,
  }
  return icons[slug] || <Wrench className={size} />
}

const categoryOrder = ['Moving Services', 'Pre-Lease Research', 'Settling In', 'Ongoing Needs']

export default function ServicesIndexPage() {
  const allServices = Object.entries(services)

  const servicesByCategory = allServices.reduce((acc, [slug, svc]) => {
    const cat = svc.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push({ slug, ...svc })
    return acc
  }, {} as Record<string, Array<{ slug: string; name: string; description: string; category: string }>>)

  const sortedCategories = [
    ...categoryOrder.filter((c) => servicesByCategory[c]?.length),
    ...Object.keys(servicesByCategory).filter((c) => !categoryOrder.includes(c)),
  ]

  // Sidebar lists (edit however you like)
  const popularSlugs = ['moving-companies', 'pest-control', 'cleaning-services']
    .filter((s) => services[s])

  const quickLinks = [
    { label: 'Locations', href: '/locations' },
    { label: 'News', href: '/news' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Services</span>
          </nav>

          {/* Hero */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Services</h1>
            <p className="text-slate-300 max-w-3xl leading-relaxed">
              Browse NYC renter services by category. Each service page has neighborhood-specific tips and what to look for.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* LEFT: categories */}
            <div className="lg:col-span-2 space-y-10">
              {sortedCategories.map((category) => {
                const list = servicesByCategory[category]
                if (!list?.length) return null

                return (
                  <section key={category}>
                    <h2 className="text-2xl font-bold mb-5">{category}</h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {list.map((svc) => (
                        <Link
                          key={svc.slug}
                          href={`/services/${svc.slug}`}
                          className="group bg-[#12161f] border border-white/5 rounded-xl p-5 hover:border-blue-500/30 hover:bg-blue-500/5 transition"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/10 transition">
                              {getServiceIcon(svc.slug, 'w-5 h-5')}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-lg mb-1 group-hover:text-blue-400 transition">
                                {svc.name}
                              </div>
                              <div className="text-sm text-slate-400 line-clamp-2">
                                {svc.description}
                              </div>
                            </div>

                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition mt-1" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>

            {/* RIGHT: sidebar (NON-STICKY) */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Popular */}
                {popularSlugs.length > 0 && (
                  <div className="bg-[#12161f] border border-white/5 rounded-xl p-5">
                    <h3 className="font-semibold mb-4 text-sm text-slate-400 uppercase tracking-wider">
                      Popular
                    </h3>
                    <div className="space-y-2">
                      {popularSlugs.map((slug) => (
                        <Link
                          key={slug}
                          href={`/services/${slug}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-white transition">
                              {getServiceIcon(slug, 'w-4 h-4')}
                            </div>
                            <span className="text-sm">{services[slug].name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick links */}
                <div className="bg-[#12161f] border border-white/5 rounded-xl p-5">
                  <h3 className="font-semibold mb-4 text-sm text-slate-400 uppercase tracking-wider">
                    Quick Links
                  </h3>
                  <div className="space-y-2">
                    {quickLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition group"
                      >
                        <span className="text-sm text-slate-300">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <h3 className="font-semibold text-lg mb-2">Check a building before you move</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Building Health X surfaces NYC building issues from open data so you can avoid bad surprises.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-semibold"
                  >
                    Search an address
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
