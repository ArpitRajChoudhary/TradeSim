import math
from tradesim.indicators import simple_moving_average
from tradesim.strategy import get_signal

def run_backtest(records, period=20, initial_cash=10_000.0, fee_rate=0.001):
    closing_prices = []

    for row in records:
        closing_prices.append(row['close'])

    moving_average = simple_moving_average(closing_prices, period)
    cash = initial_cash
    btc_held = 0.0
    execution_count = 0
    completed_trades = 0
    entry_price = -1
    realised_pnl = 0
    total_fee_paid = 0
    buy_fee = 0

    for i in range(period, len(closing_prices) - 1):
        previous_ma = moving_average[i - period]
        previous_closing = records[i - 1]['close']
        current_ma = moving_average[i - period + 1]
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
            # print(f"Signal Date: {records[i]['datetime_utc']}\nExecution Date: {records[i + 1]['datetime_utc']}\n Execution Price: {execution_price}\n Action: {signal}\n Cash: {cash}\n BTC held: {btc_held}\n")
    final_equity = cash + btc_held * closing_prices[-1]
    pnl = final_equity - initial_cash
    unrealised_pnl = 0   
    if (btc_held == 1.0):
        unrealised_pnl = closing_prices[-1] - entry_price - buy_fee

    if not math.isclose(pnl, realised_pnl + unrealised_pnl, abs_tol=0.01):
        raise ValueError("PnL mismatch: Accounting verification failed!")
    
    return {
        "final_equity": final_equity,
        "pnl": pnl,
        "realised_pnl": realised_pnl,
        "unrealised_pnl": unrealised_pnl,
        "total_fee_paid": total_fee_paid,
        "execution_count": execution_count,
        "completed_trades": completed_trades,
        "return_percentage": pnl / initial_cash * 100
    }