'use client'

import React, { useEffect, useState } from 'react'
import { Activity, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

interface NewsArticle {
    id: string
    title: string
    source: string
    url: string
    published_at: string
    summary: string
    sentiment: 'bullish' | 'bearish' | 'neutral'
}

export function NewsFeed() {
    const [news, setNews] = useState<NewsArticle[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/v1/news`)
                if (res.ok) {
                    const data = await res.json()
                    setNews(data)
                }
            } catch (err) {
                console.error("News fetch error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchNews()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center p-6 bg-card glass-panel rounded-lg h-full">
                <span className="text-muted-foreground flex items-center gap-2 animate-pulse text-sm">
                    <Activity className="w-4 h-4" /> Fetching latest news...
                </span>
            </div>
        )
    }

    const getSentimentIcon = (sentiment: string) => {
        switch (sentiment) {
            case 'bullish': return <TrendingUp className="w-4 h-4 text-green-500" />
            case 'bearish': return <TrendingDown className="w-4 h-4 text-red-500" />
            default: return <Minus className="w-4 h-4 text-slate-500" />
        }
    }

    const getTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`
        const diffInHours = Math.floor(diffInMinutes / 60)
        if (diffInHours < 24) return `${diffInHours}h ago`
        return `${Math.floor(diffInHours / 24)}d ago`
    }

    return (
        <div className="flex flex-col h-full w-full glass-panel bg-card rounded-lg overflow-hidden border border-border/50">
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/10">
                <h3 className="font-semibold text-lg">Market News</h3>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full animate-pulse">Live</span>
            </div>

            <div className="flex-1 overflow-y-auto w-full p-2 space-y-2">
                {news.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No recent news.</p>
                ) : (
                    news.map((item) => (
                        <a
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block p-3 rounded-md hover:bg-secondary/30 border border-transparent hover:border-border/30 transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between gap-3 mb-1">
                                <h4 className="font-medium text-sm leading-tight text-white/90 group-hover:text-primary transition-colors flex-1">
                                    {item.title}
                                </h4>
                                <div className="bg-background/80 p-1.5 rounded-md shrink-0">
                                    {getSentimentIcon(item.sentiment)}
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground line-clamp-2 mt-2 mb-3">
                                {item.summary}
                            </p>

                            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                                <span className="uppercase tracking-wider opacity-80">{item.source}</span>
                                <div className="flex items-center gap-2">
                                    <span>{getTimeAgo(item.published_at)}</span>
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </a>
                    ))
                )}
            </div>
        </div>
    )
}
