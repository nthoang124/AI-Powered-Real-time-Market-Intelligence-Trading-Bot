'use client'

import React, { useEffect } from 'react'
import { useMarketStore } from '@/store/marketStore'
import { cn } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const WATCHLIST = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT']

export function PriceTable() {
    const { connect, disconnect, subscribe, unsubscribe, prices, isConnected } = useMarketStore()

    useEffect(() => {
        connect()
        // Need a tiny delay to ensure socket is ready
        const timer = setTimeout(() => {
            subscribe(WATCHLIST)
        }, 1000)

        return () => {
            clearTimeout(timer)
            unsubscribe(WATCHLIST)
            disconnect()
        }
    }, [])

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    Real-time Prices
                    <span className={cn(
                        "inline-flex h-2 w-2 rounded-full",
                        isConnected ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" : "bg-red-500"
                    )} title={isConnected ? "Live" : "Disconnected"} />
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 rounded-t-lg">
                        <tr>
                            <th className="px-4 py-3 font-medium rounded-tl-lg">Symbol</th>
                            <th className="px-4 py-3 font-medium text-right">Price (USD)</th>
                            <th className="px-4 py-3 font-medium text-right">24h Change</th>
                            <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {WATCHLIST.map((symbol) => {
                            const data = prices[symbol]

                            const isUp = data && data.prevPrice ? data.price > data.prevPrice : true
                            const isDown = data && data.prevPrice ? data.price < data.prevPrice : false

                            return (
                                <tr key={symbol} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                                    <td className="px-4 py-4 font-bold text-foreground">
                                        {symbol.replace('USDT', '')}
                                        <span className="text-xs text-muted-foreground font-normal ml-1">USDT</span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <PriceCell price={data?.price} isUp={isUp} isDown={isDown} />
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className={cn(
                                            "flex items-center justify-end gap-1 font-medium",
                                            (data?.change || 0) >= 0 ? "text-green-500" : "text-red-500"
                                        )}>
                                            {(data?.change || 0) >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                            {Math.abs(data?.change || 0).toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right text-muted-foreground font-mono">
                                        {data ? data.volume.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// Subcomponent to handle the flash effect animation efficiently without re-rendering the whole table
function PriceCell({ price, isUp, isDown }: { price?: number, isUp: boolean, isDown: boolean }) {
    const [flash, setFlash] = React.useState<'up' | 'down' | null>(null)

    React.useEffect(() => {
        if (!price) return

        if (isUp) setFlash('up')
        else if (isDown) setFlash('down')

        const timer = setTimeout(() => setFlash(null), 500)
        return () => clearTimeout(timer)
    }, [price, isUp, isDown])

    if (!price) return <span className="text-muted-foreground animate-pulse">---</span>

    return (
        <span className={cn(
            "font-mono font-medium transition-colors duration-300",
            flash === 'up' ? "text-green-400" : flash === 'down' ? "text-red-400" : "text-foreground"
        )}>
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
        </span>
    )
}
