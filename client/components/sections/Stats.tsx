import { Users, TrendingUp, Star, Shield } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '10M+',
    label: 'Active Users',
    description: 'Join millions of users earning cashback',
    color: 'text-blue-600'
  },
  {
    icon: TrendingUp,
    value: '₹500Cr+',
    label: 'Cashback Earned',
    description: 'Total cashback paid to users',
    color: 'text-green-600'
  },
  {
    icon: Star,
    value: '4.8/5',
    label: 'User Rating',
    description: 'Highly rated by our users',
    color: 'text-yellow-600'
  },
  {
    icon: Shield,
    value: '100%',
    label: 'Secure',
    description: 'Bank-level security for all transactions',
    color: 'text-purple-600'
  }
]

export function Stats() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Trusted by Millions
          </h2>
          <p className="text-xl text-primary-100">
            Join the cashback revolution and start saving today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 group-hover:bg-opacity-20 transition-all duration-300">
                <div className={`w-16 h-16 ${stat.color} bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                
                <div className="text-lg font-semibold text-white mb-2">
                  {stat.label}
                </div>
                
                <div className="text-primary-100 text-sm">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Why Choose CashKaro?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">No Hidden Fees</h4>
                  <p className="text-primary-100 text-sm">Earn cashback without any charges or fees</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Instant Payouts</h4>
                  <p className="text-primary-100 text-sm">Get your cashback credited within 24-48 hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Wide Selection</h4>
                  <p className="text-primary-100 text-sm">Shop from 1000+ popular brands and stores</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}