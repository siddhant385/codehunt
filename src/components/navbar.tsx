'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import {
  User,
  LogOut,
  ChevronDown,
  Settings,
  Menu,
  X,
  Hexagon,
} from 'lucide-react'

import { User, LogOut, ChevronDown, Settings, Layers } from 'lucide-react'

import { signOut } from '@/actions/auth/auth'
import { ThemeToggle } from './theme-toggle'

interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  companyName: string
  links: NavLink[]
  profileButtonLabel?: string
  userEmail?: string
  onProfileClick?: () => void
  isLoggedIn?: boolean
}

export default function Navbar({
  companyName,
  links,
  profileButtonLabel = 'Profile',
  userEmail,
  isLoggedIn = false,
}: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div className=" fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 flex justify-center">
      <nav className="w-full max-w-7xl flex items-center justify-between px-6 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm rounded-full border border-gray-200 dark:border-slate-800">
        {/* Company Name */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="p-1.5 rounded-lg text-blue-600 dark:text-blue-500">
            <Layers className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {companyName}
          </h1>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
    <>
      <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 flex justify-center">
        <nav className="w-full max-w-7xl flex items-center justify-between px-5 py-2.5 glass-panel rounded-2xl shadow-lg shadow-black/[0.04] dark:shadow-black/20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md shadow-primary/25">
              <Hexagon className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              {companyName}
            </h1>
          </Link>

          {/* Center Links — Desktop */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive(link.href)
                    ? 'text-primary bg-primary/8 dark:bg-primary/15'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                {/* Profile Dropdown */}
                <div className="flex-shrink-0 relative" ref={menuRef}>
                  <Button
                    variant="ghost"
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-xl px-3 h-9 text-sm font-medium hover:bg-muted/50"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/80 to-chart-2/80 flex items-center justify-center">
                      <User size={12} className="text-white" />
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">{profileButtonLabel}</span>
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 text-muted-foreground ${open ? 'rotate-180' : ''}`}
                    />
                  </Button>

                  {open && (
                    <div className="absolute right-0 mt-2 w-56 glass-panel rounded-xl shadow-xl py-1.5 z-50 animate-scale-in">
                      <div className="px-4 py-2.5 border-b border-border/50 mb-1">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {profileButtonLabel}
                        </p>
                        {userEmail && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {userEmail}
                          </p>
                        )}
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 transition-colors mx-1 rounded-lg"
                      >
                        <Settings size={14} className="text-muted-foreground shrink-0" />
                        Settings
                      </Link>
                      <div className="border-t border-border/50 my-1 mx-3" />
                      <button
                        onClick={() => {
                          setOpen(false)
                          signOut()
                        }}
                        className="flex items-center gap-2.5 w-[calc(100%-8px)] mx-1 px-4 py-2 text-sm text-destructive hover:bg-destructive/8 transition-colors rounded-lg"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                <ThemeToggle />
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold px-5 h-9 text-sm shadow-md shadow-primary/25 hidden sm:flex">
                    Log in
                  </Button>
                </Link>
                <ThemeToggle />
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-20 left-4 right-4 glass-panel rounded-2xl shadow-xl p-4 animate-scale-in">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive(link.href)
                      ? 'text-primary bg-primary/8'
                      : 'text-foreground/80 hover:bg-muted/50'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isLoggedIn && (
                <Link
                  href="/auth/login"
                  className="mt-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg text-center"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>

          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Profile Dropdown */}
              <div className="flex-shrink-0 relative" ref={menuRef}>
                <Button
                  variant="outline"
                  onClick={() => setOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full px-4"
                >
                  <User size={16} />
                  {profileButtonLabel}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                  />
                </Button>


                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700 mb-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {profileButtonLabel}
                      </p>
                      {userEmail && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {userEmail}
                        </p>
                      )}
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Settings size={15} className="text-gray-400" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 dark:border-slate-700 my-1" />
                    <button
                      onClick={() => {
                        setOpen(false)
                        signOut()
                      }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-xl"
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </div>

                )}
              </div>
              <ThemeToggle />
            </>
          ) : (
            <div className="flex items-center gap-4 pl-2">
              
              <Link href="/auth/login">
                <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 shadow-sm hidden sm:flex">
                  Log in
                </Button>
              </Link>
              <div className="border-l border-slate-200 dark:border-slate-700 h-6 mx-1"></div>
              <ThemeToggle />
            </div>
          )}
        </div>
      </nav>
    </div>

  )
}
