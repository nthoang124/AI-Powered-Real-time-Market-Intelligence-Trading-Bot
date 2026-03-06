import pandas as pd
import pandas_ta as ta
from sklearn.preprocessing import MinMaxScaler
import numpy as np

class FeatureEngineer:
    def __init__(self):
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        
    def add_technical_indicators(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add RSI, MACD, Bollinger Bands, and handle indicators."""
        df = df.copy()
        
        # RSI
        df.ta.rsi(length=14, append=True)
        
        # MACD
        df.ta.macd(fast=12, slow=26, signal=9, append=True)
        
        # Bollinger Bands
        df.ta.bbands(length=20, std=2, append=True)
        
        # Fill or drop NaNs resulting from indicator windows
        df.bfill(inplace=True)
        df.ffill(inplace=True)
        
        return df

    def create_sliding_windows(self, df: pd.DataFrame, window_size: int = 60):
        """Normalize and create sequences of window_size for LSTM input."""
        # Define the continuous features we want to use
        feature_cols = ['open', 'high', 'low', 'close', 'volume', 'RSI_14', 'MACD_12_26_9']
        
        # Ensure columns exist, if not fill with 0
        for col in feature_cols:
            if col not in df.columns:
                df[col] = 0.0
                
        data_filtered = df[feature_cols].values
        
        # Fit transform scaler
        scaled_data = self.scaler.fit_transform(data_filtered)
        
        X, y = [], []
        for i in range(window_size, len(scaled_data)):
            X.append(scaled_data[i-window_size:i])
            # Prediting the 'close' price (index 3)
            y.append(scaled_data[i, 3])
            
        return np.array(X), np.array(y)
    
    def normalize_inference_data(self, df: pd.DataFrame, window_size: int = 60):
        """Prepare real-time sequence for prediction."""
        df = self.add_technical_indicators(df)
        feature_cols = ['open', 'high', 'low', 'close', 'volume', 'RSI_14', 'MACD_12_26_9']
        data_filtered = df[feature_cols].values
        
        scaled_data = self.scaler.fit_transform(data_filtered)
        
        # Get the last window
        if len(scaled_data) < window_size:
            # Pad if not enough
            pad = np.zeros((window_size - len(scaled_data), len(feature_cols)))
            scaled_data = np.vstack([pad, scaled_data])
            
        last_window = scaled_data[-window_size:]
        return np.array([last_window])

    def denormalize_price(self, scaled_pred: float) -> float:
        """Denormalize a single predicted target price back to its original scale."""
        # Using a dummy row to isolate the price scalar transformation index
        dummy = np.zeros((1, 7))
        dummy[0, 3] = scaled_pred
        return float(self.scaler.inverse_transform(dummy)[0, 3])
