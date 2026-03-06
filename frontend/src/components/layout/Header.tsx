import { Bell, Search, User, ChevronDown } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function Header() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    async function signOut() {
        'use server'
        const supabaseAction = await createClient()
        await supabaseAction.auth.signOut()
        redirect('/login')
    }

    return (
        <header className="h-16 flex-shrink-0 border-b border-border glass-panel rounded-none border-x-0 border-t-0 bg-card/60 z-10 sticky top-0">
            <div className="flex h-full items-center justify-between px-6">
                {/* Search Bar */}
                <div className="flex flex-1 items-center">
                    <div className="relative w-full max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                            type="search"
                            placeholder="Search markets, symbols, or news..."
                            className="block w-full rounded-full border border-border bg-secondary/30 py-1.5 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>
                </div>

                {/* Right Nav */}
                <div className="flex items-center gap-4 ml-4">
                    <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50">
                        <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_var(--color-destructive)]" />
                        <Bell className="h-5 w-5" />
                    </button>

                    <div className="h-6 w-px bg-border" />

                    {/* User Dropdown (Simplified for now) */}
                    <div className="flex items-center gap-2 pl-2 cursor-pointer group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-medium text-sm shadow-sm">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="hidden md:flex flex-col items-start leading-none ml-1">
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                {user?.email?.split('@')[0] || 'User'}
                            </span>
                            <span className="text-xs text-muted-foreground">Premium User</span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
                    </div>

                    {/* Quick Sign Out form (In a real app this goes into a dropdown menu) */}
                    <form action={signOut}>
                        <button className="text-xs px-2 py-1 rounded bg-secondary/50 hover:bg-destructive/20 hover:text-destructive text-muted-foreground transition-colors">
                            Log out
                        </button>
                    </form>
                </div>
            </div>
        </header>
    )
}
