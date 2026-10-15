import csv
import math
from datetime import datetime

data_path = '/home/arpit-raj-choudhary/TradeSim/data/raw/BTCUSD_bitstamp_daily_2012-2026.csv'

def load_market_data(data_path):
    with open(data_path, 'r') as f:
        reader = csv.DictReader(f)
        required_columns = ['datetime_utc', 'open', 'high', 'low', 'close', 'volume']
        missing = set(required_columns) - set(reader.fieldnames)
        if missing:
            raise ValueError("The file doesn't meet our required columns!")
        records = []
        previous_datetime = None
        for row_number, row in enumerate(reader, start=2):
            if row['datetime_utc'].strip() == "":
                raise ValueError(f"Empty timestamp at CSV row {row_number}")
            try:
                current_datetime = datetime.fromisoformat(row['datetime_utc'])
            except ValueError:
                raise ValueError(f"Invalid timestamp at CSV row {row_number}")

            if previous_datetime is not None and current_datetime <= previous_datetime: 
                raise ValueError(f"Duplicate or out-of-order timestamp at CSV row {row_number}")

            previous_datetime = current_datetime

            try:
                record = {
                    'datetime_utc': row['datetime_utc'],
                    'open': float(row['open']),
                    'high': float(row['high']),
                    'low': float(row['low']),
                    'close': float(row['close']),
                    'volume': float(row['volume'])
                }
            except (ValueError, TypeError) as e:
                raise ValueError(
                    f"Invalid data at CSV row {row_number}: {e}"
                ) from e

            

            price_fields = ['open', 'high', 'low', 'close']

            for field in ['open', 'high', 'low', 'close', 'volume']:
                if not math.isfinite(record[field]):
                    raise ValueError(
                        f"Non-finite {field} at CSV row {row_number}"
                    )

            for field in price_fields:
                if record[field] <= 0:
                    raise ValueError(
                        f"Invalid {field} price at CSV row {row_number}: "
                        f"{record[field]}"
                    )

            if record['volume'] < 0:
                raise ValueError(
                    f"Negative volume at CSV row {row_number}: "
                    f"{record['volume']}"
                )

            for field in ['open', 'low', 'close']:
                if record['high'] < record[field]:
                    raise ValueError(f"In line {row_number}, high {record['high']} is lower than expected {record[field]}")
            for field in ['open', 'high', 'close']:
                if record['low'] > record[field]:
                    raise ValueError(f"In line {row_number}, low {record['low']} is higher than expected {record[field]}")
            records.append(record)

        
        return records


records = load_market_data(data_path)

closing_prices = []

for row in records:
    closing_prices.append(row['close'])

moving_average = []

moving_average_iterator = 0

while (moving_average_iterator + 20 <= len(closing_prices)):
    moving_average.append(sum(closing_prices[moving_average_iterator:moving_average_iterator+20])/20)
    moving_average_iterator+=1

#in range, it prints all, but for checking purpose, we can use a constant like 25
# for i in range(19, len(closing_prices)):
#     print(f"Date: {records[i]['datetime_utc']}\nClosing Price: {records[i]['close']}")
#     print(f"Moving Average: {moving_average[i - 19]}")
#     print()



def get_signal(previous_ma, previous_closing, current_ma, current_closing):
    if (previous_closing <= previous_ma and current_closing > current_ma):
            return "BUY"
    elif (previous_closing >= previous_ma and current_closing < current_ma):
        return "SELL"
    else:
        return "HOLD"


cash = 10_000.0
btc_held = 0.0
execution_count = 0
completed_trades = 0
entry_price = -1
realised_pnl = 0
fee_rate = 0.001
total_fee_paid = 0
buy_fee = 0
for i in range(20, len(closing_prices) - 1):
    previous_ma = moving_average[i - 20]
    previous_closing = records[i - 1]['close']
    current_ma = moving_average[i - 19]
    current_closing = records[i]['close']
    execution_price = records[i + 1]['open']

    signal = get_signal(
        previous_ma, previous_closing,
        current_ma, current_closing
    )
    flag = -1
    
    if (signal == 'BUY' and btc_held == 0 and cash >= execution_price * (1 + fee_rate)):
        execution_fee = execution_price * fee_rate
        buy_fee = execution_fee
        cash-=(execution_price + execution_fee)
        total_fee_paid+=execution_fee
        entry_price = execution_price
        btc_held = 1.0
        flag = 0
    if (signal == 'SELL' and btc_held == 1.0):
        execution_fee = execution_price * fee_rate
        cash+=(execution_price - execution_fee)
        total_fee_paid+=execution_fee
        trade_pnl = execution_price - entry_price - execution_fee - buy_fee
        realised_pnl+=trade_pnl
        btc_held = 0.0
        flag = 0
        completed_trades+=1
    if (flag == 0):
        execution_count+=1
        print(f"Signal Date: {records[i]['datetime_utc']}\nExecution Date: {records[i + 1]['datetime_utc']}\n Execution Price: {execution_price}\n Action: {signal}\n Cash: {cash}\n BTC held: {btc_held}\n")

final_equity = cash + btc_held * closing_prices[-1]
pnl = final_equity - 10000
unrealised_pnl = 0   
if (btc_held == 1.0):
    unrealised_pnl = closing_prices[-1] - entry_price - buy_fee

if math.isclose(pnl, realised_pnl + unrealised_pnl, abs_tol=0.01):
    print("Verified PnL")
else:
    print("PnL mismatch!")

print(f"Final Equity: {final_equity}")
print(f"Total Fee Paid: {total_fee_paid}")
print(f"Profit/Loss Overall: {pnl}\nRealised Profit/Loss: {realised_pnl}\nReturn Percentange: {pnl / 10000 * 100}")
print(f"Execution Count: {execution_count}\n Completed trades: {completed_trades}")


# date_string = "2026-03-23 00:00:00+00:00"

# parsed_date = datetime.fromisoformat(date_string)

# print(parsed_date)
# print(type(parsed_date))