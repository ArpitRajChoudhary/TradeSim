import math
from datetime import datetime
from tradesim.market_data import load_market_data
from tradesim.engine import run_backtest

data_path = '/home/arpit-raj-choudhary/TradeSim/data/raw/BTCUSD_bitstamp_daily_2012-2026.csv'

records = load_market_data(data_path)

result = run_backtest(records)
print(result)




