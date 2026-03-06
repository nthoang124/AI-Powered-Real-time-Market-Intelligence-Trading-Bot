'use client'

import React, { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'

// Adjust backend URL as needed
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

interface OrderLevel {
    price: number
    quantity: number
    total: number
}

interface OrderBookData {
    symbol: string
    bids: OrderLevel[]
    asks: OrderLevel[]
    last_update: string
}

export function OrderBook({ symbol = 'BTCUSDT' }: { symbol?: string }) {
    const [data, setData] = useState<OrderBookData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // In a real application, you'd use WebSockets for orderbook depth.
        // For MVP, we'll poll the REST endpoint every 2 seconds.
        const fetchOrderBook = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/v1/market/orderbook/${symbol}`)
                if (res.ok) {
                    const json = await res.json()
                    setData(json)
                }
            } catch (err) {
                console.error("OrderBook fetch error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrderBook()
        const interval = setInterval(fetchOrderBook, 2000)
        return () => clearInterval(interval)
    }, [symbol])

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <span className="text-muted-foreground flex items-center gap-2 animate-pulse text-sm">
                    <Activity className="w-4 h-4" /> Loading Order Book...
                </span>
            </div>
        )
    }

    if (!data) return <div className="p-4 text-center">Failed to load Order Book</div>

    // We want to render Asks at the top (descending price) and Bids at the bottom (descending price)
    const asks = [...data.asks].reverse() // highest ask first (top of list)
    const bids = data.bids

    return (
        <div className="w-full h-full flex flex-col text-sm border border-border/50 rounded-lg overflow-hidden glass-panel bg-card">
            <div className="flex justify-between p-3 border-b border-border/50 bg-secondary/20">
                <h3 className="font-semibold">Order Book</h3>
                <span className="text-muted-foreground">{symbol}</span>
            </div>

            <div className="grid grid-cols-3 P-2 text-xs text-muted-foreground font-medium px-4 py-2 opacity-80 border-b border-border/20">
                <span>Price</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Total</span>
            </div>

            <div className="flex-1 overflow-y-auto w-full font-mono flex flex-col py-1 space-y-px">
                {/* ASKS (Red) */}
                <div className="flex flex-col mb-1 text-red-500">
                    {asks.slice(0, 15).map((ask, i) => (
                        <div key={`ask-${i}`} className="grid grid-cols-3 px-4 py-[2px] relative group hover:bg-secondary/30 transition-colors cursor-pointer">
                            {/* Visual Depth Bar background (simulated) */}
                            <div
                                className="absolute right-0 top-0 bottom-0 bg-red-500/10 z-0 transition-all"
                                style={{ width: `${Math.min((ask.total / 10) * 100, 100)}%` }}
                            />
                            <span className="z-10">{ask.price.toFixed(2)}</span>
                            <span className="text-right z-10 text-white/80">{ask.quantity.toFixed(4)}</span>
                            <span className="text-right z-10 text-white/50">{ask.total.toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                {/* Current Mid-Price approximation */}
                <div className="px-4 py-2 flex items-center justify-center font-bold text-lg border-y border-border/20 bg-background/50">
                    {data.bids[0] ? ((data.asks[data.asks.length - 1]?.price + data.bids[0]?.price) / 2).toFixed(2) : '---'}
                </div>

                {/* BIDS (Green) */}
                <div className="flex flex-col mt-1 text-green-500">
                    {bids.slice(0, 15).map((bid, i) => (
                        <div key={`bid-${i}`} className="grid grid-cols-3 px-4 py-[2px] relative group hover:bg-secondary/30 transition-colors cursor-pointer">
                            {/* Visual Depth Bar background (simulated) */}
                            <div
                                className="absolute right-0 top-0 bottom-0 bg-green-500/10 z-0 transition-all"
                                style={{ width: `${Math.min((bid.total / 10) * 100, 100)}%` }}
                            />
                            <span className="z-10">{bid.price.toFixed(2)}</span>
                            <span className="text-right z-10 text-white/80">{bid.quantity.toFixed(4)}</span>
                            <span className="text-right z-10 text-white/50">{bid.total.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
