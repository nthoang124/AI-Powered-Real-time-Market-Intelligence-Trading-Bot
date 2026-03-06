import { Activity } from 'lucide-react'
import { PriceTable } from '@/components/dashboard/PriceTable'
import { TradingChart } from '@/components/dashboard/TradingChart'
import { Heatmap } from '@/components/dashboard/Heatmap'
import { OrderBook } from '@/components/dashboard/OrderBook'
import { NewsFeed } from '@/components/dashboard/NewsFeed'
import { EconomicCalendar } from '@/components/dashboard/EconomicCalendar'
import { SentimentGauge } from '@/components/dashboard/SentimentGauge'
import { AIPanel } from '@/components/dashboard/AIPanel'

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Market Dashboard</h1>
                <div className="flex items-center gap-2">
                    {/* Action buttons could go here */}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="glass-panel p-6">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Portfolio Metric</h3>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-2xl font-bold">---</div>
                    </div>
                ))}
                <div className="lg:col-span-1 p-0 m-0 h-full min-h-[220px]">
                    <SentimentGauge symbol="BTCUSDT" />
                </div>
            </div>

            <div className="grid gap-6 mb-6">
                <AIPanel symbol="BTCUSDT" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-6">
                <div className="glass-panel lg:col-span-4 p-6 flex flex-col min-h-[400px]">
                    <TradingChart symbol="BTCUSDT" />
                </div>

                <div className="glass-panel p-6 lg:col-span-3 flex flex-col min-h-[400px]">
                    <PriceTable />
                </div>
            </div>

            {/* Heatmap Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-6">
                <div className="glass-panel p-6 flex flex-col lg:col-span-4 min-h-[450px]">
                    <h3 className="font-semibold text-lg mb-4">Market Cap Heatmap</h3>
                    <div className="flex-1 w-full relative overflow-hidden">
                        <Heatmap width={800} height={350} />
                    </div>
                </div>

                <div className="glass-panel flex flex-col lg:col-span-3 min-h-[450px]">
                    <OrderBook symbol="BTCUSDT" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-6">
                <div className="glass-panel lg:col-span-4 min-h-[400px]">
                    <EconomicCalendar />
                </div>

                <div className="lg:col-span-3 min-h-[400px]">
                    <NewsFeed />
                </div>
            </div>
        </div>
    )
}
