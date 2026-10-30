def get_signal(previous_ma, previous_closing, current_ma, current_closing):
    if (previous_closing <= previous_ma and current_closing > current_ma):
            return "BUY"
    elif (previous_closing >= previous_ma and current_closing < current_ma):
        return "SELL"
    else:
        return "HOLD"