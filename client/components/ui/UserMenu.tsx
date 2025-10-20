'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, Settings, Wallet, LogOut, ChevronDown } from 'lucide-react'
import { Button } from './Button'

interface UserMenuProps {
  user: {
    name: string
    email: string
    wallet: {
      balance: number
    }
  }
  onLogout: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2"
      >
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-primary-600" />
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700">
          {user.name}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <Wallet className="h-4 w-4 mr-1" />
                <span>₹{user.wallet.balance.toFixed(2)}</span>
              </div>
            </div>

            {/* Menu Items */}
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4 mr-3" />
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 mr-3" />
              Profile Settings
            </Link>
            <Link
              href="/wallet"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Wallet className="h-4 w-4 mr-3" />
              My Wallet
            </Link>
            <div className="border-t border-gray-100">
              <button
                onClick={() => {
                  onLogout()
                  setIsOpen(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}