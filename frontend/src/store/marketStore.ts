import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'

export interface AssetPrice {
    symbol: string
    price: number
    volume: number
    timestamp: number
    change?: number  // Placeholder for 24h change
    prevPrice?: number // To determine up/down visual tick
}

interface MarketState {
    prices: Record<string, AssetPrice>
    isConnected: boolean
    socket: Socket | null
    connect: () => void
    disconnect: () => void
    subscribe: (symbols: string[]) => void
    unsubscribe: (symbols: string[]) => void
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export const useMarketStore = create<MarketState>((set, get) => ({
    prices: {},
    isConnected: false,
    socket: null,

    connect: () => {
        if (get().socket) return

        const socket = io(BACKEND_URL, {
            transports: ['websocket'],
            autoConnect: true,
        })

        socket.on('connect', () => {
            set({ isConnected: true })
            console.log('Connected to market data stream')
        })

        socket.on('disconnect', () => {
            set({ isConnected: false })
            console.log('Disconnected from market data stream')
        })

        socket.on('price-update', (data: AssetPrice) => {
            set((state) => {
                const prevData = state.prices[data.symbol]
                return {
                    prices: {
                        ...state.prices,
                        [data.symbol]: {
                            ...data,
                            prevPrice: prevData?.price,
                            // Calculate a dummy change for UI purposes if real backend doesn't provide it yet
                            change: prevData ? ((data.price - prevData.price) / prevData.price) * 100 : 0
                        }
                    }
                }
            })
        })

        set({ socket })
    },

    disconnect: () => {
        const { socket } = get()
        if (socket) {
            socket.disconnect()
            set({ socket: null, isConnected: false })
        }
    },

    subscribe: (symbols: string[]) => {
        const { socket } = get()
        if (socket && socket.connected) {
            socket.emit('subscribe', symbols)
        }
    },

    unsubscribe: (symbols: string[]) => {
        const { socket } = get()
        if (socket && socket.connected) {
            socket.emit('unsubscribe', symbols)
        }
    }
}))
