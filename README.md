# TradeSim

**A Modular Historical Market Data Backtesting Platform**

TradeSim is a trading strategy research and backtesting platform
designed to simulate trading strategies on historical market data. It
combines a Python-based backtesting engine with a FastAPI backend and an
interactive React frontend to provide a visual environment for testing,
analyzing, and understanding trading strategies.

The project aims to evolve into a comprehensive trading simulation
platform where users can experiment with strategies, inspect trade
executions, analyze performance, and eventually develop and test more
advanced trading systems.

## Current Features

### 1. Historical Market Data

-   Loads historical BTC/USD market data from CSV files.
-   Validates market data before processing.
-   Checks OHLCV values, timestamps, and data consistency.
-   Supports historical daily candlestick data.

### 2. Backtesting Engine

-   Python-based modular backtesting engine.
-   Simple Moving Average (SMA) crossover strategy.
-   Configurable SMA period.
-   Simulated buy and sell executions.
-   Executes trades at the next candle's opening price.
-   Supports configurable starting capital and trading fees.

### 3. Performance Analysis

The engine calculates:

-   Final portfolio equity.
-   Total Profit and Loss (P&L).
-   Realised P&L.
-   Unrealised P&L.
-   Total trading fees.
-   Number of trade executions.
-   Number of completed trades.
-   Overall return percentage.

The engine also performs an accounting consistency check to verify the
relationship between total P&L, realised P&L, and unrealised P&L.

### 4. Backend API

Built using **FastAPI**.

Current API endpoints:

  -----------------------------------------------------------------------
  Method                  Endpoint                Description
  ----------------------- ----------------------- -----------------------
  GET                     `/api/market-data`      Retrieves historical
                                                  market data

  POST                    `/api/backtest`         Runs a backtest with
                                                  configurable parameters
  -----------------------------------------------------------------------

Additional backend capabilities:

-   Request validation using Pydantic.
-   Cross-Origin Resource Sharing (CORS) configuration.
-   Interactive API documentation through Swagger UI.

API documentation is available at `/docs` when the backend is running.

### 5. Interactive Frontend

Built using **React, TypeScript, and Vite**.

Current interface features:

-   Interactive BTC/USD candlestick chart.
-   Historical OHLC price information.
-   Configurable SMA period.
-   Adjustable starting capital.
-   Configurable trading fee.
-   Backtest execution through the UI.
-   Performance results displayed after execution.
-   Optional buy/sell markers on the chart.
-   Toggle to show or hide trade execution markers.

The chart uses Lightweight Charts for financial market visualization.

## Technology Stack

  Component              Technology
  ---------------------- --------------------
  Programming Language   Python
  Backend Framework      FastAPI
  API Server             Uvicorn
  Data Validation        Pydantic
  Frontend               React
  Frontend Language      TypeScript
  Build Tool             Vite
  Charting Library       Lightweight Charts
  Data Processing        Python
  Version Control        Git and GitHub

## Project Structure

``` text
TradeSim/
│
├── data/
│   └── raw/
│       └── BTCUSD_bitstamp_daily_2012-2026.csv
│
├── src/
│   └── tradesim/
│       ├── __init__.py
│       ├── market_data.py
│       ├── indicators.py
│       ├── strategy.py
│       ├── engine.py
│       └── api.py
│
├── tests/
│   └── test_indicators.py
│
├── web-ui/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── main.py
├── pyproject.toml
└── README.md
```

## Getting Started

### Prerequisites

-   Python 3.10 or later.
-   Node.js and npm.
-   Git.

### 1. Clone the Repository

``` bash
git clone <YOUR_REPOSITORY_URL>
cd TradeSim
```

### 2. Set Up the Python Environment

``` bash
python -m venv .venv
source .venv/bin/activate
```

Install the project and its dependencies:

``` bash
python -m pip install -e .
python -m pip install fastapi "uvicorn[standard]"
```

### 3. Start the Backend

From the TradeSim project root:

``` bash
python -m uvicorn tradesim.api:app --reload
```

The backend will run at:

``` text
http://127.0.0.1:8000
```

Interactive API documentation:

``` text
http://127.0.0.1:8000/docs
```

### 4. Start the Frontend

Open a second terminal:

``` bash
cd web-ui
npm install
npm run dev
```

Open the local Vite URL displayed in your terminal, usually:

``` text
http://localhost:5173
```

Keep both the backend and frontend running while using TradeSim.

## How to Use

1.  Launch the backend and frontend.
2.  Open TradeSim in your browser.
3.  View historical BTC/USD candlestick data.
4.  Configure the SMA period.
5.  Set the starting capital.
6.  Configure the trading fee.
7.  Click **Run Backtest**.
8.  Review the resulting performance statistics.
9.  Use **Show Buy/Sell** to visualize actual trade executions on the
    chart.
10. Hide the markers whenever you want a cleaner chart.

## Development Roadmap

TradeSim is being developed incrementally, with an emphasis on
modularity, correctness, and extensibility.

### Phase 1 --- Core Backtesting Foundation

-   [x] Historical market data loading.
-   [x] OHLCV data validation.
-   [x] SMA indicator implementation.
-   [x] SMA crossover strategy.
-   [x] Trade execution simulation.
-   [x] Trading fee calculation.
-   [x] P&L and portfolio accounting.
-   [x] Basic backtesting API.

### Phase 2 --- Frontend and Visualization

-   [x] React-based trading interface.
-   [x] FastAPI and frontend integration.
-   [x] Interactive candlestick chart.
-   [x] Configurable backtest parameters.
-   [x] Backtest performance display.
-   [x] Buy/sell execution markers.
-   [x] Show/hide execution markers.

### Phase 3 --- Advanced Market Data and Charting

-   [ ] Multiple chart timeframes (1m, 5m, 15m, 30m, 1H, 4H, 1D).
-   [ ] Intraday historical market data integration.
-   [ ] Dynamic timeframe-based data aggregation.
-   [ ] Consistent backtesting across selected timeframes.
-   [ ] Improved chart navigation and analysis.

### Phase 4 --- Advanced Backtesting

-   [ ] Multiple technical indicators.
-   [ ] Multiple strategy configurations.
-   [ ] Improved position sizing and risk management.
-   [ ] Stop-loss and take-profit mechanisms.
-   [ ] Detailed trade history.
-   [ ] Performance metrics such as maximum drawdown and Sharpe ratio.
-   [ ] Strategy comparison and optimization.

### Phase 5 --- Strategy Intelligence

-   [ ] Natural-language strategy configuration.
-   [ ] AI-assisted strategy interpretation.
-   [ ] Conversion of strategy descriptions into structured rules.
-   [ ] Strategy validation before execution.

### Phase 6 --- Product Maturity

-   [ ] Historical data management improvements.
-   [ ] Persistent storage of backtest results.
-   [ ] User-defined strategies.
-   [ ] Exportable backtest reports.
-   [ ] Testing and deployment improvements.

*Roadmap items represent planned development, not currently implemented
functionality.*

## Design Philosophy

TradeSim follows a modular development approach:

-   **Separation of concerns:** Market data, indicators, strategies,
    execution logic, APIs, and frontend visualization remain separate
    components.
-   **Reproducibility:** Backtests should use consistent historical data
    and clearly defined parameters.
-   **Transparency:** Trade executions and performance calculations
    should be inspectable.
-   **Extensibility:** New indicators, strategies, and market data
    sources should be possible without rewriting the core engine.
-   **Validation:** Data integrity and financial calculations should be
    checked rather than assumed.

## Disclaimer

TradeSim is an educational and research-oriented historical trading
simulation platform.

Backtesting results are based on historical market data and configured
assumptions. They do not guarantee future performance or profitability.
Simulated execution may not fully represent real-world market
conditions, liquidity, slippage, or exchange behavior.

## Contributing

Contributions, suggestions, bug reports, and feature ideas are welcome.

The project is under active development, and its architecture and
capabilities may evolve over time.

------------------------------------------------------------------------

**TradeSim --- Build strategies. Test assumptions. Understand
performance.**
