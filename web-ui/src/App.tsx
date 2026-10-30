import CandlestickChart from './CandlestickChart'
import './App.css'
import { useState } from 'react'

function App() {
  const [smaPeriod, setSmaPeriod] = useState(20)
  const [initialCapital, setInitialCapital] = useState(10000)
  const [feeRate, setFeeRate] = useState(0.1)

  const [results, setResults] = useState<{
    final_equity: number
    pnl: number
    realised_pnl: number
    unrealised_pnl: number
    total_fee_paid: number
    execution_count: number
    completed_trades: number
    return_percentage: number
    executions: {
      time: string
      price: number
      type: 'buy' | 'sell'
    }[]
  } | null>(null)

  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState('')


  async function runBacktest() {
    setIsRunning(true)
    setError('')

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/backtest',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            period: smaPeriod,
            initial_cash: initialCapital,
            fee_rate: feeRate / 100,
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Backtest request failed')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong',
      )
    } finally {
      setIsRunning(false)
    }
  }


  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <h1>Tradesim</h1>
          <span>Strategy Lab</span>
        </div>
      </header>
      <section className="workspace">
        <section className="chart-panel">
          <div className="panel-heading">
            <h2>BTC / USD</h2>
            <span>1D · Bitcoin / US Dollar</span>
          </div>

          <div className="chart-placeholder">
            <CandlestickChart
              executions={results?.executions ?? []}
            />
          </div>
        </section>

        <aside className="settings-panel">
          <h2>Strategy Settings</h2>
          <p>Configure your backtest.</p>

          <div className="setting-field">
            <label htmlFor="sma-period">SMA Period</label>
              <input
                id="sma-period"
                type="number"
                min="1"
                max="500"
                value={smaPeriod}
                onChange={(event) => setSmaPeriod(Number(event.target.value))}
              />
              <span>Number of candles used to calculate the average.</span>
          </div>

          <div className="setting-field">
            <label htmlFor="initial-capital">Starting Capital ($)</label>
            <input
              id="initial-capital"
              type="number"
              min="1"
              value={initialCapital}
              onChange={(event) =>
                setInitialCapital(Number(event.target.value))
              }         
            />
          </div>

          <div className="setting-field">
            <label htmlFor="fee-rate">Trading Fee (%)</label>
            <input
              id="fee-rate"
              type="number"
              min="0"
              max="10"
              step="0.01"
              value={feeRate}
              onChange={(event) => setFeeRate(Number(event.target.value))}
            />
          </div>
          <div className="config-summary">
            <p>SMA Period: {smaPeriod}</p>
            <p>Starting Capital: ${initialCapital.toLocaleString()}</p>
            <p>Trading Fee: {feeRate}%</p>
          </div>


          <button onClick={runBacktest} disabled={isRunning}>
            {isRunning ? 'Running Backtest...' : 'Run Backtest'}
          </button>

          {error && <p role="alert">{error}</p>}


          {results && (
            <div className="config-summary">
              <h3>Backtest Results</h3>
              <p>Final Equity: ${results.final_equity.toFixed(2)}</p>
              <p>
                Profit / Loss: ${results.pnl.toFixed(2)}
              </p>
              <p>
                Realised P&L: ${results.realised_pnl.toFixed(2)}
              </p>
              <p>
                Unrealised P&L: ${results.unrealised_pnl.toFixed(2)}
              </p>
              <p>
                Total Fees: ${results.total_fee_paid.toFixed(2)}
              </p>
              <p>Executions: {results.execution_count}</p>
              <p>Completed Trades: {results.completed_trades}</p>
              <p>
                Return: {results.return_percentage.toFixed(2)}%
              </p>
            </div>
          )}



          <p>Selected period: {smaPeriod}</p>
        </aside>
      </section>
    </main>
  )
}

export default App
