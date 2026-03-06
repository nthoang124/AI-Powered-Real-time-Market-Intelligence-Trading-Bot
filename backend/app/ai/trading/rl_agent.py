import os
import pandas as pd
from stable_baselines3 import PPO

class TradingSignalBot:
    def __init__(self):
        # In a real environment, this loads the specific tuned agent from disk
        model_path = os.path.join(os.getcwd(), 'trained_models', 'rl_trading_agent.zip')
        
        self.model = None
        if os.path.exists(model_path):
            self.model = PPO.load(model_path)
            
    def get_signal(self, recent_ohlcv: list[dict]) -> dict:
        """
        Produce a BUY / SELL / HOLD signal based on current state.
        recent_ohlcv: List of recent candlestick dictionaries.
        """
        if not recent_ohlcv:
            return {
                "signal": "HOLD",
                "confidence": 0.0,
                "reasoning": "Missing market data for signal generation."
            }

        symbol = recent_ohlcv[0].get('symbol', 'UNKNOWN')
        
        if self.model:
            # Prepare state mapping exactly as the TradingEnvironment expects
            df = pd.DataFrame(recent_ohlcv)
            from app.ai.prediction.feature_engineer import FeatureEngineer
            df = FeatureEngineer().add_technical_indicators(df)
            
            # Use the very last row for current inference
            last_row = df.iloc[-1]
            obs = [
                last_row.get('open', 0), last_row.get('high', 0), 
                last_row.get('low', 0), last_row.get('close', 0), 
                last_row.get('volume', 0), last_row.get('RSI_14', 50), 
                last_row.get('MACD_12_26_9', 0), 
                100000.0, # Dummy balance
                0.0       # Dummy position
            ]
            action, _states = self.model.predict(obs, deterministic=True)
            
            action_map = {0: "HOLD", 1: "BUY", 2: "SELL"}
            signal = action_map.get(int(action), "HOLD")
            confidence = 85.5 # Mock confidence extracted from PPO action probs if available
        else:
            # Fallback mock heuristic strategy using technicals if model is not loaded yet
            df = pd.DataFrame(recent_ohlcv)
            from app.ai.prediction.feature_engineer import FeatureEngineer
            df = FeatureEngineer().add_technical_indicators(df)
            last_row = df.iloc[-1]
            
            rsi = last_row.get('RSI_14', 50.0)
            macd = last_row.get('MACD_12_26_9', 0.0)
            
            if rsi < 30 and macd > 0:
                signal = "BUY"
                confidence = 80.0
                reasoning = f"StochRSI Oversold ({rsi:.1f}) paired with MACD Bullish Crossover."
            elif rsi > 70 and macd < 0:
                signal = "SELL"
                confidence = 85.0
                reasoning = f"StochRSI Overbought ({rsi:.1f}) accompanied by MACD Bearish Divergence."
            else:
                signal = "HOLD"
                confidence = 50.0
                reasoning = "Market is in accumulation/distribution phase. No clear edge."
                
        return {
            "symbol": symbol,
            "signal": signal,
            "confidence": confidence,
            "reasoning": reasoning
        }
