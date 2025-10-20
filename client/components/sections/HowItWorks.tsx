import { Search, ShoppingBag, Wallet, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const steps = [
  {
    icon: Search,
    title: 'Find Deals',
    description: 'Browse through thousands of deals and offers from your favorite stores',
    color: 'bg-blue-500'
  },
  {
    icon: ShoppingBag,
    title: 'Shop & Earn',
    description: 'Click on deals, shop normally, and earn cashback on every purchase',
    color: 'bg-green-500'
  },
  {
    icon: Wallet,
    title: 'Get Cashback',
    description: 'Receive your cashback in your wallet within 24-48 hours',
    color: 'bg-yellow-500'
  },
  {
    icon: Download,
    title: 'Withdraw',
    description: 'Transfer your earnings to your bank account anytime',
    color: 'bg-purple-500'
  }
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start earning cashback in just 4 simple steps. It's that easy!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Earning?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Join millions of users who are already saving money with CashKaro
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/register">Get Started Free</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/how-it-works">Learn More</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}