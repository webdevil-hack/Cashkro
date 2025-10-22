'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface StatItem {
  label: string
  value: string
  suffix?: string
  icon: string
}

const stats: StatItem[] = [
  {
    label: 'Total Cashback Earned',
    value: '50',
    suffix: 'Crore+',
    icon: '💰'
  },
  {
    label: 'Active Users',
    value: '10',
    suffix: 'Lakh+',
    icon: '👥'
  },
  {
    label: 'Partner Stores',
    value: '1000',
    suffix: '+',
    icon: '🏪'
  },
  {
    label: 'Successful Transactions',
    value: '1',
    suffix: 'Crore+',
    icon: '✅'
  }
]

function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count}</span>
}

export function Stats() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Millions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join millions of smart shoppers who save money with every purchase
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-cashkaro-primary mb-2">
                <AnimatedCounter end={parseInt(stat.value)} />
                {stat.suffix}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Additional trust indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>RBI Approved</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Instant Payouts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}