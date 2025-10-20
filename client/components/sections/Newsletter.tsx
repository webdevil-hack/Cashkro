'use client'

import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true)
      setIsLoading(false)
      setEmail('')
    }, 1000)
  }

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-r from-green-500 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Successfully Subscribed!
            </h3>
            <p className="text-gray-600 mb-6">
              Thank you for subscribing to our newsletter. You'll receive the latest deals and cashback offers directly in your inbox.
            </p>
            <Button
              onClick={() => setIsSubscribed(false)}
              variant="outline"
            >
              Subscribe Another Email
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Latest Deals
          </h2>
          <p className="text-xl text-primary-100">
            Get exclusive cashback offers and deals delivered to your inbox
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                loading={isLoading}
                disabled={!email || isLoading}
              >
                Subscribe
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Join 500,000+ subscribers who get the best deals first
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">No spam, ever</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Exclusive offers</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Unsubscribe anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}