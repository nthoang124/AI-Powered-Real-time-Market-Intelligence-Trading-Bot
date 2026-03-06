'use client'

import React, { useEffect, useState } from 'react'
import { Activity, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

interface EconomicEvent {
    id: string
    event: string
    country: string
    date: string
    impact: 'high' | 'medium' | 'low'
    actual?: string
    forecast?: string
    previous?: string
}

export function EconomicCalendar() {
    const [events, setEvents] = useState<EconomicEvent[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/v1/calendar`)
                if (res.ok) {
                    const data = await res.json()
                    setEvents(data)
                }
            } catch (err) {
                console.error("Calendar fetch error:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchCalendar()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center p-6 bg-card glass-panel rounded-lg h-full">
                <span className="text-muted-foreground flex items-center gap-2 animate-pulse text-sm">
                    <Activity className="w-4 h-4" /> Loading economic events...
                </span>
            </div>
        )
    }

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20'
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
            default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
        }
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
    }

    return (
        <div className="flex flex-col h-full w-full glass-panel bg-card rounded-lg overflow-hidden border border-border/50">
            <div className="flex items-center gap-2 p-4 border-b border-border/50 bg-secondary/10">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Economic Calendar</h3>
            </div>

            <div className="flex-1 overflow-y-auto w-full p-2 space-y-2">
                {events.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No upcoming events.</p>
                ) : (
                    events.map((evt) => (
                        <div key={evt.id} className="p-3 rounded-md hover:bg-secondary/30 border border-transparent transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                        {evt.country}
                                    </span>
                                    <h4 className="font-medium text-sm text-foreground">{evt.event}</h4>
                                </div>
                                <div className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold tracking-wider ${getImpactColor(evt.impact)}`}>
                                    {evt.impact}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                    <p className="text-muted-foreground text-[10px] uppercase">Date</p>
                                    <p className="font-medium">{formatDate(evt.date)}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-[10px] uppercase">Forecast</p>
                                    <p className="font-medium text-foreground">{evt.forecast || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-[10px] uppercase">Previous</p>
                                    <p className="font-medium text-muted-foreground">{evt.previous || '-'}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
