def simple_moving_average(closing_prices, period):
    if not isinstance(period, int) or isinstance(period, bool) or (period <= 0):
        raise ValueError("The period for moving average is invalid (<= 0)")
    moving_average = []

    moving_average_iterator = 0
    
    while (moving_average_iterator + period <= len(closing_prices)):
        moving_average.append(sum(closing_prices[moving_average_iterator:moving_average_iterator+period])/period)
        moving_average_iterator+=1
    return moving_average

# Test:
# closing_prices = [10, 20, 30, 40, 50]
# period = -1
# print(simple_moving_average(closing_prices, period))