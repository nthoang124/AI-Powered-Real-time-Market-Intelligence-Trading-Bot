'use client'

import React, { useEffect, useState } from 'react'
import { Activity, BrainCircuit } from 'lucide-react'
import { FeatureGate } from '@/components/ui/FeatureGate'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

interface ArticleSentiment {
    text: string
    positive: number
    neutral: number
    negative: number
}

interface SentimentData {
    symbol: string
    market_sentiment: number
    label: string
    details: ArticleSentiment[]
}

export function SentimentGauge({ symbol = 'BTCUSDT' }: { symbol?: string }) {
    const [data, setData] = useState<SentimentData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSentiment = async () => {
            try {
                // In a real app we would pass an auth token header here
                const res = await fetch(`${BACKEND_URL}/api/v1/ai/sentiment/${symbol}`, {
                    headers: { 'Authorization': 'Bearer fake-premium-token-for-mvp' }
                })
                if (res.ok) {
                    const json = await res.json()
                    setData(json)
                }
            } catch (err) {
                console.error("AI fetch error:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchSentiment()
    }, [symbol])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-6 bg-card glass-panel rounded-lg h-full border border-primary/20">
                <BrainCircuit className="w-8 h-8 text-primary mb-3 animate-pulse" />
                <span className="text-muted-foreground text-sm flex gap-2">
                    Analyzing market psychology with PhoBERT...
                </span>
            </div>
        )
    }

    if (!data) return <div className="p-4 text-center">Failed to load AI Sentiment</div>

    const pct = Math.min(Math.max(data.market_sentiment, 0), 100)
    const angle = (pct / 100) * 180 - 90 // -90 to 90 degrees

    return (
        <FeatureGate requiredTier="pro">
            <div className="flex flex-col h-full w-full glass-panel bg-card rounded-lg overflow-hidden border border-primary/30 relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-50" />

                <div className="flex items-center gap-2 p-4 border-b border-border/50 bg-secondary/10">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">AI Sentiment Tracker</h3>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-auto border border-primary/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                        Powered by PhoBERT
                    </span>
                </div>

                <div className="p-6 flex flex-col items-center justify-center flex-1">
                    {/* Custom SVG Gauge */}
                    <div className="relative w-48 h-24 overflow-hidden mb-2">
                        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-secondary opacity-50 stroke-round" strokeLinecap="round" />
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="transparent" stroke="url(#gradient)" strokeWidth="8" strokeDasharray={`${(pct / 100) * 125} 125`} className="stroke-round" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#ef4444" />
                                    <stop offset="50%" stopColor="#eab308" />
                                    <stop offset="100%" stopColor="#22c55e" />
                                </linearGradient>
                            </defs>
                            {/* Needle */}
                            <g transform={`translate(50, 50) rotate(${angle})`}>
                                <polygon points="-2,0 2,0 0,-38" fill="currentColor" className="text-primary" />
                                <circle cx="0" cy="0" r="4" fill="currentColor" className="text-primary" />
                            </g>
                        </svg>
                    </div>

                    <div className="text-center">
                        <div className="text-4xl font-bold tracking-tighter mb-1">{data.market_sentiment.toFixed(1)}</div>
                        <div className={`text-sm font-bold uppercase tracking-widest ${data.label === 'Bullish' ? 'text-green-500' : data.label === 'Bearish' ? 'text-red-500' : 'text-yellow-500'}`}>
                            {data.label}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-secondary/20 border-t border-border/30">
                    <p className="text-xs text-muted-foreground mb-2 font-medium uppercase">Recent Analyzed Headlines</p>
                    <ul className="space-y-2 text-xs">
                        {data.details.map((d, i) => (
                            <li key={i} className="flex flex-col gap-1 border-b border-border/10 pb-2 last:border-0">
                                <span className="text-white/80 line-clamp-1" title={d.text}>{d.text}</span>
                                <div className="flex gap-2">
                                    <span className="text-green-500/80">Bull: {(d.positive * 100).toFixed(0)}%</span>
                                    <span className="text-red-500/80">Bear: {(d.negative * 100).toFixed(0)}%</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </FeatureGate>
    )
}
