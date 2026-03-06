'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts'
import { Activity } from 'lucide-react'

// Adjust backend URL as needed
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

interface OHLCV {
    time: string
    open: number
    high: number
    low: number
    close: number
    volume: number
}

export function TradingChart({ symbol = 'BTCUSDT' }: { symbol?: string }) {
    const chartContainerRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const chartRef = useRef<IChartApi | null>(null)
    const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null)

    useEffect(() => {
        if (!chartContainerRef.current) return

        // Create chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#94a3b8',
            },
            grid: {
                vertLines: { color: '#1e293b' },
                horzLines: { color: '#1e293b' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            crosshair: {
                mode: 1, // Magnet mode
            },
            rightPriceScale: {
                borderColor: '#1e293b',
            },
            timeScale: {
                borderColor: '#1e293b',
                timeVisible: true,
            },
        })

        chartRef.current = chart

        // @ts-ignore
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        })
        candlestickSeriesRef.current = candlestickSeries

        // @ts-ignore
        const volumeSeries = chart.addHistogramSeries({
            color: '#3b82f6',
            priceFormat: { type: 'volume' },
            priceScaleId: '', // set as an overlay
        })

        // Position the volume chart overlay at the bottom
        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        })
        volumeSeriesRef.current = volumeSeries

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth })
            }
        }
        window.addEventListener('resize', handleResize)

        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${BACKEND_URL}/api/v1/market/ohlcv/${symbol}?limit=200`)
                if (!res.ok) throw new Error('Failed to fetch OHLCV data')

                const data: OHLCV[] = await res.json()

                const candleData = data.map(d => ({
                    time: new Date(d.time).getTime() / 1000 as any, // lightweight-charts expects unix timestamp in seconds for TS
                    open: d.open,
                    high: d.high,
                    low: d.low,
                    close: d.close,
                })).sort((a, b) => (a.time as number) - (b.time as number))

                const volData = data.map(d => ({
                    time: new Date(d.time).getTime() / 1000 as any,
                    value: d.volume,
                    color: d.close >= d.open ? '#22c55e40' : '#ef444440'
                })).sort((a, b) => (a.time as number) - (b.time as number))

                candlestickSeries.setData(candleData)
                volumeSeries.setData(volData)
                chart.timeScale().fitContent()
                setError(null)
            } catch (err: any) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

        return () => {
            window.removeEventListener('resize', handleResize)
            chart.remove()
        }
    }, [symbol])

    return (
        <div className="relative w-full h-full min-h-[400px]">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
                <h2 className="text-xl font-bold">{symbol}</h2>
                {/* Can add timeframe selectors here later */}
            </div>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
                    <span className="text-muted-foreground flex items-center gap-2 animate-pulse">
                        <Activity className="w-4 h-4" />
                        Loading chart data...
                    </span>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            <div ref={chartContainerRef} className="w-full h-[400px]" />
        </div>
    )
}
