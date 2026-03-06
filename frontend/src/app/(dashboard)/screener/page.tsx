import { StockScreener } from '@/components/dashboard/StockScreener'

export default function ScreenerPage() {
    return (
        <div className="flex flex-col gap-6 w-full h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Market Screener</h1>
                    <p className="text-muted-foreground text-sm">Find trading opportunities based on technical indicators.</p>
                </div>
            </div>

            <div className="w-full">
                <StockScreener />
            </div>
        </div>
    )
}
