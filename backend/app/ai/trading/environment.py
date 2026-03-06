import gymnasium as gym
from gymnasium import spaces
import numpy as np

class TradingEnvironment(gym.Env):
    """
    Custom Environment for simulating trading that follows gym interface.
    """
    metadata = {'render.modes': ['human']}

    def __init__(self, df, initial_balance=100000.0):
        super(TradingEnvironment, self).__init__()
        
        self.df = df
        self.initial_balance = initial_balance
        
        # Actions of the format Buy x%, Sell x%, Hold, etc.
        # Simple discrete space: 0: Hold, 1: Buy, 2: Sell
        self.action_space = spaces.Discrete(3)

        # State space: [Open, High, Low, Close, Volume, RSI, MACD, Balance, Position]
        # In a real model, this would be highly abstracted or normalized.
        self.observation_space = spaces.Box(
            low=-np.inf, high=np.inf, shape=(9,), dtype=np.float32
        )

        self.reset()

    def reset(self, seed=None, options=None):
        super().reset(seed=seed, options=options)
        self.balance = self.initial_balance
        self.net_worth = self.initial_balance
        self.max_net_worth = self.initial_balance
        self.shares_held = 0
        
        self.current_step = 0
        
        return self._next_observation(), {}

    def _next_observation(self):
        # Extract features for current step
        obs = np.array([
            self.df.loc[self.current_step, 'open'],
            self.df.loc[self.current_step, 'high'],
            self.df.loc[self.current_step, 'low'],
            self.df.loc[self.current_step, 'close'],
            self.df.loc[self.current_step, 'volume'],
            self.df.loc[self.current_step, 'RSI_14'] if 'RSI_14' in self.df.columns else 50.0,
            self.df.loc[self.current_step, 'MACD_12_26_9'] if 'MACD_12_26_9' in self.df.columns else 0.0,
            self.balance,
            self.shares_held,
        ], dtype=np.float32)
        return obs

    def step(self, action):
        # Execute one time step within the environment
        self._take_action(action)
        
        self.current_step += 1
        
        if self.current_step > len(self.df.index) - 1:
            self.current_step = 0  # Loop or end episode
            
        delay_modifier = (self.current_step / len(self.df.index))
        # Calculate Reward: Net worth minus previous net worth
        reward = self.net_worth - self.initial_balance
        reward = reward * delay_modifier
        
        done = self.net_worth <= 0 or self.current_step == len(self.df.index) - 1
        
        obs = self._next_observation()
        
        return obs, reward, done, False, {}

    def _take_action(self, action):
        current_price = self.df.loc[self.current_step, "close"]
        
        # Action logic
        if action == 1: # Buy
            shares_bought = self.balance / current_price
            self.balance -= shares_bought * current_price
            self.shares_held += shares_bought
            
        elif action == 2: # Sell
            self.balance += self.shares_held * current_price
            self.shares_held = 0
            
        self.net_worth = self.balance + self.shares_held * current_price
        
        if self.net_worth > self.max_net_worth:
            self.max_net_worth = self.net_worth

    def render(self, mode='human', close=False):
        profit = self.net_worth - self.initial_balance
        print(f'Step: {self.current_step}')
        print(f'Balance: {self.balance}')
        print(f'Shares held: {self.shares_held}')
        print(f'Net Worth: {self.net_worth}')
        print(f'Profit: {profit}')
