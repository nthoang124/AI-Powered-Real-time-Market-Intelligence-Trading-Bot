'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    PieChart,
    Activity,
    Search,
    Bell,
    Trophy,
    CalendarDays,
    Settings
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Portfolio', href: '/portfolio', icon: PieChart },
    { name: 'Trading', href: '/trading', icon: Activity },
    { name: 'Screener', href: '/screener', icon: Search },
    { name: 'Alerts', href: '/alerts', icon: Bell },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Calendar', href: '/calendar', icon: CalendarDays },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full w-64 glass-panel rounded-none border-t-0 border-l-0 border-b-0">
            <div className="flex h-16 items-center flex-shrink-0 px-6 border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg shadow-blue-500/20 shadow-[0_0_15px]">
                        AI
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        AI Trader Bot
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                    Menu
                </div>
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                )}
                                aria-hidden="true"
                            />
                            {item.name}

                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                            )}
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t border-border mt-auto">
                <Link
                    href="/settings"
                    className={cn(
                        "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        pathname === '/settings'
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                >
                    <Settings className="mr-3 flex-shrink-0 h-5 w-5" />
                    Settings
                </Link>
            </div>
        </div>
    )
}
