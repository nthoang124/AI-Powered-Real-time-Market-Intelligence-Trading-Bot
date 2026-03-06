'use client'

import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Target, BrainCircuit, Bot, Zap } from 'lucide-react'
import { FeatureGate } from '@/components/ui/FeatureGate'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

interface PredictionData {
    symbol: string
    current_price: number
    predicted_price: number
    direction: string
    change_pct: number
    horizon_minutes: number
    confidence: number
}

interface SignalData {
    symbol: string
    signal: string
    confidence: number
    reasoning: string
}

export function AIPanel({ symbol = 'BTCUSDT' }: { symbol?: string }) {
    const [prediction, setPrediction] = useState<PredictionData | null>(null)
    const [signal, setSignal] = useState<SignalData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        const fetchData = async () => {
            setLoading(true)
            try {
                const headers = { 'Authorization': 'Bearer mvp-premium-token' }

                const [predRes, sigRes] = await Promise.all([
                    fetch(`${BACKEND_URL}/api/v1/ai/prediction/${symbol}`, { headers }),
                    fetch(`${BACKEND_URL}/api/v1/ai/signals/${symbol}`, { headers })
                ])

                if (predRes.ok && mounted) {
                    setPrediction(await predRes.json())
                }
                if (sigRes.ok && mounted) {
                    setSignal(await sigRes.json())
                }
            } catch (err) {
                console.error("AI Panel fetch error:", err)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchData()
        // Refresh every 1 minute
        const interval = setInterval(fetchData, 60000)
        return () => {
            mounted = false
            clearInterval(interval)
        }
    }, [symbol])

    if (loading && !prediction) {
        return (
            <div className="flex flex-col items-center justify-center p-6 bg-card glass-panel rounded-lg h-full border border-primary/20">
                <Bot className="w-8 h-8 text-primary mb-3 animate-pulse" />
                <span className="text-muted-foreground text-sm flex gap-2">
                    Running Inference Pipeline...
                </span>
            </div>
        )
    }

    return (
        <FeatureGate requiredTier="pro">
            <div className="flex flex-col md:flex-row gap-4 h-full w-full">

                {/* Price Prediction Panel */}
                <div className="flex-1 glass-panel bg-card rounded-lg overflow-hidden border border-primary/30 relative flex flex-col">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-50" />

                    <div className="flex items-center gap-2 p-4 border-b border-border/50 bg-secondary/10">
                        <Target className="w-5 h-5 text-indigo-400" />
                        <h3 className="font-semibold text-lg">LSTM Deep Learning</h3>
                        <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full ml-auto border border-indigo-500/30">
                            {prediction?.horizon_minutes || 30}m Forecast
                        </span>
                    </div>

                    <div className="p-6 flex flex-col justify-center flex-1">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Predicted Price</p>
                                <div className="text-3xl font-bold font-mono">
                                    ${prediction?.predicted_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}
                                </div>
                            </div>
                            <div className={`flex items-center gap-1 font-bold px-3 py-1 rounded-md ${prediction?.direction === 'UP' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                {prediction?.direction === 'UP' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                {prediction?.change_pct.toFixed(2)}%
                            </div>
                        </div>

                        <div className="w-full bg-secondary/50 rounded-full h-2 mb-1 overflow-hidden">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${prediction?.confidence || 0}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground text-right">{prediction?.confidence || 0}% Model Confidence</p>
                    </div>
                </div>

                {/* RL Signal Panel */}
                <div className="flex-1 glass-panel bg-card rounded-lg overflow-hidden border border-primary/30 relative flex flex-col">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50" />

                    <div className="flex items-center gap-2 p-4 border-b border-border/50 bg-secondary/10">
                        <Zap className="w-5 h-5 text-purple-400 opacity-80" />
                        <h3 className="font-semibold text-lg">RL Trading Agent</h3>
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full ml-auto border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                            Auto-Pilot
                        </span>
                    </div>

                    <div className="p-6 flex flex-col justify-center flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-muted-foreground mb-1">Execution Action</p>
                        </div>
                        <div className="flex items-center justify-center mb-4">
                            <div className={`text-4xl font-extrabold tracking-widest px-8 py-3 rounded-xl border-2 ${signal?.signal === 'BUY' ? 'text-green-500 border-green-500/50 bg-green-500/10' :
                                    signal?.signal === 'SELL' ? 'text-red-500 border-red-500/50 bg-red-500/10' :
                                        'text-yellow-500 border-yellow-500/50 bg-yellow-500/10'
                                }`}>
                                {signal?.signal || 'HOLD'}
                            </div>
                        </div>

                        <div className="bg-secondary/20 p-3 rounded-lg border border-border/30">
                            <p className="text-xs text-muted-foreground leading-relaxed italic">
                                {signal?.reasoning || "Analyzing latest ticks..."}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </FeatureGate>
    )
}
