'use client'

import React, { useMemo } from 'react'
import * as d3 from 'd3'
import { cn } from '@/lib/utils'

interface HeatmapItem {
    name: string
    category: string
    value: number // Market Cap alias
    change: number // 24h change
}

// Dummy data since we don't have the Market Cap / Sector Backend API fully populated yet
const MOCK_DATA: HeatmapItem[] = [
    { name: 'BTC', category: 'Layer 1', value: 800000000, change: 2.5 },
    { name: 'ETH', category: 'Layer 1', value: 300000000, change: -1.2 },
    { name: 'BNB', category: 'Exchange', value: 80000000, change: 0.5 },
    { name: 'SOL', category: 'Layer 1', value: 60000000, change: 5.4 },
    { name: 'XRP', category: 'Payments', value: 30000000, change: -0.1 },
    { name: 'ADA', category: 'Layer 1', value: 20000000, change: -2.0 },
    { name: 'DOGE', category: 'Meme', value: 15000000, change: 12.0 },
    { name: 'DOT', category: 'Layer 1', value: 10000000, change: 1.1 },
    { name: 'UNI', category: 'DeFi', value: 5000000, change: -4.5 },
    { name: 'LINK', category: 'Oracle', value: 8000000, change: 3.2 },
]

interface HeatmapProps {
    width?: number
    height?: number
    data?: HeatmapItem[]
}

export function Heatmap({ width = 600, height = 400, data = MOCK_DATA }: HeatmapProps) {

    const root = useMemo(() => {
        // Group by category, but for simplicity a flat hierarchy under 'market' is fine
        const hierarchyData = {
            name: 'market',
            children: data
        }

        const compiledHierarchy = d3.hierarchy(hierarchyData)
            .sum((d: any) => d.value ?? 0)
            .sort((a, b) => (b.value || 0) - (a.value || 0))

        const treemapLayout = d3.treemap<any>()
            .size([width, height])
            .paddingInner(2)
            .paddingOuter(2)
            .round(true)

        return treemapLayout(compiledHierarchy)
    }, [width, height, data])

    const leaves = root.leaves()

    // Color scale
    // Typically: Red (< -3%), Dark Red (-3% to 0%), Dark Green (0% to +3%), Green (> +3%)
    const getColor = (change: number) => {
        if (change <= -3) return '#ef4444' // red-500
        if (change < 0) return '#991b1b'   // red-800
        if (change === 0) return '#334155' // slate-700
        if (change <= 3) return '#065f46'  // emerald-800
        return '#10b981'                   // emerald-500
    }

    return (
        <div className="w-full h-full relative" style={{ width, height }}>
            <svg width={width} height={height} className="overflow-visible rounded-lg">
                {leaves.map((leaf, i) => {
                    const item = leaf.data
                    const rectWidth = leaf.x1 - leaf.x0
                    const rectHeight = leaf.y1 - leaf.y0

                    return (
                        <g
                            key={`${item.name}-${i}`}
                            transform={`translate(${leaf.x0},${leaf.y0})`}
                            className="group cursor-pointer transition-opacity hover:opacity-80"
                        >
                            <rect
                                width={rectWidth}
                                height={rectHeight}
                                fill={getColor(item.change)}
                                rx={4}
                                ry={4}
                                className="stroke-background stroke-[2px]"
                            />
                            {/* Only show label if the rectangle is big enough */}
                            {rectWidth > 50 && rectHeight > 30 && (
                                <text
                                    x={rectWidth / 2}
                                    y={rectHeight / 2}
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    className="fill-white font-bold text-sm pointer-events-none"
                                >
                                    {item.name}
                                    <tspan
                                        x={rectWidth / 2}
                                        dy="1.2em"
                                        className="font-normal text-xs opacity-80"
                                    >
                                        {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                                    </tspan>
                                </text>
                            )}
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}
