'use client'

import React, { useEffect, useState } from 'react'
import { Activity, Filter, ArrowUpDown } from 'lucide-react'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

interface ScreenerResult {
    symbol: string
    price: number
    change_24h: number
    volume_24h: number
    rsi_14: number
    macd: string
    signal: string
}

export function StockScreener() {
    const [data, setData] = useState<ScreenerResult[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchScreener = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/v1/screener`)
                if (res.ok) {
                    const json = await res.json()
                    setData(json)
                }
            } catch (err) {
                console.error("Screener fetch error:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchScreener()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 bg-card glass-panel rounded-lg w-full min-h-[400px]">
                <span className="text-muted-foreground flex items-center gap-2 animate-pulse">
                    <Activity className="w-5 h-5" /> Scanning markets...
                </span>
            </div>
        )
    }

    const getSignalColor = (signal: string) => {
        if (signal.includes('Buy')) return 'text-green-500 bg-green-500/10'
        if (signal.includes('Sell')) return 'text-red-500 bg-red-500/10'
        return 'text-slate-400 bg-slate-500/10'
    }

    return (
        <div className="glass-panel w-full rounded-lg overflow-hidden border border-border/50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/20">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" /> Technical Screener
                </h3>
                <button className="text-sm px-3 py-1.5 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors">
                    Filters
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-secondary/10 border-b border-border/50">
                        <tr>
                            <th className="px-6 py-4 font-medium flex items-center gap-1 cursor-pointer hover:text-foreground">Symbol <ArrowUpDown className="w-3 h-3" /></th>
                            <th className="px-6 py-4 font-medium text-right cursor-pointer hover:text-foreground">Price</th>
                            <th className="px-6 py-4 font-medium text-right cursor-pointer hover:text-foreground">24h Chg</th>
                            <th className="px-6 py-4 font-medium text-right cursor-pointer hover:text-foreground">Vol (24h)</th>
                            <th className="px-6 py-4 font-medium text-center cursor-pointer hover:text-foreground">RSI (14)</th>
                            <th className="px-6 py-4 font-medium text-center">MACD</th>
                            <th className="px-6 py-4 font-medium text-center">Signal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                        {data.map((row) => (
                            <tr key={row.symbol} className="hover:bg-secondary/20 transition-colors">
                                <td className="px-6 py-4 font-bold">{row.symbol}</td>
                                <td className="px-6 py-4 text-right font-mono">${row.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td className={`px-6 py-4 text-right font-medium ${row.change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {row.change_24h > 0 ? '+' : ''}{row.change_24h.toFixed(2)}%
                                </td>
                                <td className="px-6 py-4 text-right text-muted-foreground font-mono">
                                    ${(row.volume_24h / 1000000).toFixed(1)}M
                                </td>
                                <td className={`px-6 py-4 text-center font-bold ${row.rsi_14 > 70 ? 'text-red-500' : row.rsi_14 < 30 ? 'text-green-500' : ''}`}>
                                    {row.rsi_14.toFixed(1)}
                                </td>
                                <td className={`px-6 py-4 text-center text-xs font-semibold ${row.macd === 'Bullish' ? 'text-green-500' : row.macd === 'Bearish' ? 'text-red-500' : 'text-slate-400'}`}>
                                    {row.macd}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border border-transparent ${getSignalColor(row.signal)}`}>
                                        {row.signal}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
