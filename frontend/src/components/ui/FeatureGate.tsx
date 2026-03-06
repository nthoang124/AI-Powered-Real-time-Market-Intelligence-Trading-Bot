'use client'

import React from 'react'
import { Lock } from 'lucide-react'

// In a real app, this would come from Supabase User Auth Metadata or a dedicated context
type UserTier = 'free' | 'pro' | 'enterprise'

const CURRENT_USER_TIER: UserTier = 'free' // hardcoded for MVP demo

interface FeatureGateProps {
    requiredTier: UserTier
    children: React.ReactNode
    fallback?: React.ReactNode
}

const tierLevels: Record<UserTier, number> = {
    'free': 0,
    'pro': 1,
    'enterprise': 2
}

export function FeatureGate({ requiredTier, children, fallback }: FeatureGateProps) {
    const isAuthorized = tierLevels[CURRENT_USER_TIER] >= tierLevels[requiredTier]

    if (isAuthorized) {
        return <>{children}</>
    }

    if (fallback) {
        return <>{fallback}</>
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-card/50 glass-panel rounded-lg border border-primary/20 text-center min-h-[200px]">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Premium Feature</h3>
            <p className="text-muted-foreground text-sm max-w-[250px] mb-4">
                You need a {requiredTier.toUpperCase()} subscription to access this powerful tool.
            </p>
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors">
                Upgrade Now
            </button>
        </div>
    )
}
