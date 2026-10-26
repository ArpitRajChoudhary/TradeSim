import CandlestickChart from './CandlestickChart'
import './App.css'
import { useState } from 'react'

function App() {
  const [smaPeriod, setSmaPeriod] = useState(20)
  const [initialCapital, setInitialCapital] = useState(10000)
  const [feeRate, setFeeRate] = useState(0.1)
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
            <CandlestickChart />
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

          <p>Selected period: {smaPeriod}</p>
        </aside>
      </section>
    </main>
  )
}

export default App
