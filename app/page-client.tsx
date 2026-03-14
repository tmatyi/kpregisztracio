'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Ticket, Shield, Zap, QrCode } from 'lucide-react'

interface Event {
  id: string
  title: string
  date: string
  location: string
  is_active: boolean
}

interface LandingPageClientProps {
  events: Event[]
}

export function LandingPageClient({ events }: LandingPageClientProps) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Fedezd fel a legjobb{' '}
              <span className="text-purple-200">eseményeket</span>
            </h1>
            <p className="text-xl sm:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Vásárolj jegyeket könnyen és biztonságosan. QR kódos belépés,
              azonnali megerősítés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-700 hover:bg-purple-50 text-lg px-8 py-6"
                onClick={() => {
                  const eventsSection = document.getElementById('events')
                  eventsSection?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <Ticket className="mr-2 h-5 w-5" />
                Események megtekintése
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                onClick={() => router.push('/dashboard')}
              >
                Rendeléseim
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Miért válassz minket?
            </h2>
            <p className="text-xl text-gray-600">
              Egyszerű, gyors és biztonságos jegyvásárlás
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Biztonságos fizetés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Barion fizetési rendszer garantálja a biztonságos tranzakciókat
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Egyszerű vásárlás</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Néhány kattintással megveheted a jegyeket, azonnali megerősítéssel
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>QR kódos belépés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Gyors és érintésmentes beléptetés QR kóddal az eseményekre
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Aktuális események
            </h2>
            <p className="text-xl text-gray-600">
              Válassz a közelgő programok közül
            </p>
          </div>

          {events.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="py-16 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Jelenleg nincsenek aktív események
                </h3>
                <p className="text-gray-600">
                  Hamarosan újabb programokkal jelentkezünk!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => router.push(`/events/${event.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="group-hover:text-purple-600 transition-colors">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3 text-gray-600">
                      <Calendar className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-start gap-3 text-gray-600">
                      <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <Button className="w-full mt-4 group-hover:bg-purple-700">
                      <Ticket className="mr-2 h-4 w-4" />
                      Jegyek vásárlása
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Készen állsz az élményre?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Ne maradj le a legjobb eseményekről. Vásárold meg jegyedet most!
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-700 hover:bg-purple-50 text-lg px-8 py-6"
            onClick={() => {
              const eventsSection = document.getElementById('events')
              eventsSection?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <Ticket className="mr-2 h-5 w-5" />
            Jegyek böngészése
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Re-Generáció</h3>
              <p className="text-sm">
                Élményekkel teli események a legjobb szervezésben
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Kapcsolat</h3>
              <p className="text-sm">Email: info@re-generacio.hu</p>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Linkek</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="hover:text-white transition-colors"
                  >
                    Rendeléseim
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/login')}
                    className="hover:text-white transition-colors"
                  >
                    Bejelentkezés
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} Re-Generáció. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
