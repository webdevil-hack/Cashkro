'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'I\'ve been using CashKaro for over 2 years and have earned more than ₹25,000 in cashback. The process is so simple and the payouts are always on time.',
    amount: '₹25,000+',
    category: 'Fashion & Electronics'
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Delhi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Amazing platform! I shop regularly and the cashback adds up quickly. The customer support is excellent and they always resolve issues promptly.',
    amount: '₹18,500+',
    category: 'Electronics & Home'
  },
  {
    id: 3,
    name: 'Sneha Patel',
    location: 'Bangalore',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'CashKaro has helped me save so much money on my regular purchases. The deals are always updated and the cashback rates are competitive.',
    amount: '₹32,000+',
    category: 'Beauty & Fashion'
  },
  {
    id: 4,
    name: 'Amit Singh',
    location: 'Pune',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'The referral program is fantastic! I\'ve earned extra cashback by referring friends. The app is user-friendly and the notifications keep me updated.',
    amount: '₹15,750+',
    category: 'Travel & Food'
  },
  {
    id: 5,
    name: 'Kavya Reddy',
    location: 'Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'I love how easy it is to track my earnings and withdraw money. The platform is trustworthy and I\'ve never had any issues with payments.',
    amount: '₹28,900+',
    category: 'Fashion & Beauty'
  },
  {
    id: 6,
    name: 'Vikram Joshi',
    location: 'Chennai',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'CashKaro has become an essential part of my shopping routine. The cashback really adds up and helps me save money on things I would buy anyway.',
    amount: '₹22,300+',
    category: 'Electronics & Books'
  }
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div key={testimonial.id} className="card hover-lift">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <blockquote className="text-gray-700 mb-4 italic">
                    "{testimonial.text}"
                  </blockquote>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-primary-600">{testimonial.amount}</span>
                    <span className="text-gray-500">{testimonial.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile/Tablet Carousel */}
          <div className="lg:hidden">
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-2">
                    <div className="card hover-lift">
                      <div className="card-body">
                        <div className="flex items-center mb-4">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full mr-3"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                            <p className="text-sm text-gray-500">{testimonial.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>

                        <blockquote className="text-gray-700 mb-4 italic">
                          "{testimonial.text}"
                        </blockquote>

                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-primary-600">{testimonial.amount}</span>
                          <span className="text-gray-500">{testimonial.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="flex justify-center mt-6 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTestimonial}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex space-x-1">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToTestimonial(i)}
                    className={`w-2 h-2 rounded-full ${
                      i === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={nextTestimonial}
                disabled={currentIndex === testimonials.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">4.8/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">10M+</div>
            <div className="text-gray-600">Happy Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">₹500Cr+</div>
            <div className="text-gray-600">Cashback Earned</div>
          </div>
        </div>
      </div>
    </section>
  )
}