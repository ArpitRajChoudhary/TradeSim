import csv
import math
from datetime import datetime

def load_market_data(data_path):
    with open(data_path, 'r') as f:
        reader = csv.DictReader(f)
        required_columns = ['datetime_utc', 'open', 'high', 'low', 'close', 'volume']
        if reader.fieldnames is None:
            raise ValueError("CSV file is empty or has no header")
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
