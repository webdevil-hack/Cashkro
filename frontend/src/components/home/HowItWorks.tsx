'use client'

import { motion } from 'framer-motion'
import { Search, MousePointer, ShoppingCart, Wallet } from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'Find Your Store',
    description: 'Search for your favorite store or browse through 1000+ partner stores',
    icon: <Search className="w-8 h-8" />,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Click & Shop',
    description: 'Click on the store link to activate cashback tracking and shop normally',
    icon: <MousePointer className="w-8 h-8" />,
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: 'Complete Purchase',
    description: 'Complete your purchase on the store website as you normally would',
    icon: <ShoppingCart className="w-8 h-8" />,
    color: 'bg-orange-500'
  },
  {
    id: 4,
    title: 'Earn Cashback',
    description: 'Get cashback credited to your wallet within 24-48 hours',
    icon: <Wallet className="w-8 h-8" />,
    color: 'bg-purple-500'
  }
]

export function HowItWorks() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start earning cashback in just 4 simple steps. It's that easy!
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                {/* Step number */}
                <div className="relative z-10 mb-6">
                  <div className={`${step.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto text-white shadow-lg`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-cashkaro-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.id}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-6 mb-2">
                    <div className="w-0.5 h-8 bg-gray-200"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Earning?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Join millions of smart shoppers and start earning cashback today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Start Shopping Now
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Watch Demo Video
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}