'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Menu, 
  X, 
  User, 
  Wallet, 
  Gift, 
  LogOut,
  Bell,
  Heart,
  Settings
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container-custom">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm text-gray-600 border-b">
          <div className="flex items-center space-x-4">
            <span>📧 support@cashkaro-clone.com</span>
            <span>📞 1800-123-4567</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/how-it-works" className="hover:text-cashkaro-primary">
              How it works
            </Link>
            <Link href="/help" className="hover:text-cashkaro-primary">
              Help
            </Link>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-cashkaro-primary to-cashkaro-secondary rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">CashKaro</span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for stores, coupons, or deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-12 py-3 w-full border-2 border-gray-200 focus:border-cashkaro-primary"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 bottom-1 px-4 bg-cashkaro-primary hover:bg-cashkaro-primary/90"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Wallet balance */}
                <div className="hidden md:flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                  <Wallet className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {formatCurrency(user?.walletBalance || 0)}
                  </span>
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                </Button>

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar} alt={user?.firstName} />
                        <AvatarFallback>
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wallet" className="flex items-center">
                        <Wallet className="mr-2 h-4 w-4" />
                        Wallet
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="flex items-center">
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="btn-primary">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 py-3 border-t">
          <Link href="/stores" className="text-gray-700 hover:text-cashkaro-primary font-medium">
            All Stores
          </Link>
          <Link href="/categories" className="text-gray-700 hover:text-cashkaro-primary font-medium">
            Categories
          </Link>
          <Link href="/coupons" className="text-gray-700 hover:text-cashkaro-primary font-medium">
            Coupons
          </Link>
          <Link href="/deals" className="text-gray-700 hover:text-cashkaro-primary font-medium">
            Deals
          </Link>
          <Link href="/cashback" className="text-gray-700 hover:text-cashkaro-primary font-medium">
            Cashback
          </Link>
          <Link href="/refer" className="text-gray-700 hover:text-cashkaro-primary font-medium">
            Refer & Earn
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container-custom py-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search stores, coupons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-12"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1 bottom-1 px-3"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {/* Mobile navigation */}
            <nav className="space-y-3">
              <Link 
                href="/stores" 
                className="block py-2 text-gray-700 hover:text-cashkaro-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                All Stores
              </Link>
              <Link 
                href="/categories" 
                className="block py-2 text-gray-700 hover:text-cashkaro-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/coupons" 
                className="block py-2 text-gray-700 hover:text-cashkaro-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Coupons
              </Link>
              <Link 
                href="/deals" 
                className="block py-2 text-gray-700 hover:text-cashkaro-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Deals
              </Link>
              <Link 
                href="/cashback" 
                className="block py-2 text-gray-700 hover:text-cashkaro-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Cashback
              </Link>
              <Link 
                href="/refer" 
                className="block py-2 text-gray-700 hover:text-cashkaro-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Refer & Earn
              </Link>
            </nav>

            {/* Mobile user menu */}
            {!isAuthenticated && (
              <div className="mt-4 pt-4 border-t space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="w-full btn-primary" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}