import { useEffect, useRef, useState } from 'react'
import { createChart, CandlestickSeries, createSeriesMarkers } from 'lightweight-charts'


type Candle = {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

type TradeExecution = {
  time: string
  price: number
  type: 'buy' | 'sell'
}

type CandlestickChartProps = {
  executions: TradeExecution[]
}


function CandlestickChart({ executions }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)

  const [candleData, setCandleData] = useState<Candle[]>([])
  const [showMarkers, setShowMarkers] = useState(false)


  useEffect(() => {
    async function fetchCandles() {
      try {
        const response = await fetch(
          'http://127.0.0.1:8000/api/market-data',
        )

        if (!response.ok) {
          throw new Error('Failed to fetch market data')
        }

        
        const data = await response.json()

        const formattedData: Candle[] = data.map(
          (record: {
            datetime_utc: string
            open: number
            high: number
            low: number
            close: number
            volume: number
          }) => ({
            time: record.datetime_utc.slice(0, 10),
            open: record.open,
            high: record.high,
            low: record.low,
            close: record.close,
            volume: record.volume,
          }),
        )

        setCandleData(formattedData)

      } catch (error) {
        console.error('Error fetching market data:', error)
      }
    }

    fetchCandles()
  }, [])


  const latestCandle = candleData[candleData.length - 1]

  const [ohlc, setOhlc] = useState({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
  })
  useEffect(() => {
    const container = chartContainerRef.current

    if (!container || candleData.length === 0) {
      return
    }

    console.log('Chart container:', container.getBoundingClientRect())

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,


      layout: {
        background: {
          color: '#11151d',
        },
        textColor: '#a3adbd',
      },

      grid: {
        vertLines: {
          color: '#1a202b',
        },
        horzLines: {
          color: '#1a202b',
        },
      },

      crosshair: {
        mode: 0,
        vertLine: {
          color: '#64748b',
          width: 1,
          style: 2,
          labelBackgroundColor: '#334155',
        },
        horzLine: {
          color: '#64748b',
          width: 1,
          style: 2,
          labelBackgroundColor: '#334155',
        },
      },
    })

    const candleSeries = chart.addSeries(
      CandlestickSeries,
      {
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      },
    )

    candleSeries.setData(candleData)

    const markers = executions.map((execution) => ({
      time: execution.time,
      position: execution.type === 'buy' ? 'belowBar' as const : 'aboveBar' as const,
      color: execution.type === 'buy' ? '#22c55e' : '#ef4444',
      shape: execution.type === 'buy' ? 'arrowUp' as const : 'arrowDown' as const,
      text: execution.type === 'buy' ? 'BUY' : 'SELL',
    }))
    const seriesMarkers = createSeriesMarkers(candleSeries, [])
    seriesMarkers.setMarkers(showMarkers ? markers : [])

    chart.timeScale().fitContent()

    chart.subscribeCrosshairMove((param) => {
      if (!param.time) {
        setOhlc({
          open: 70000,
          high: 70200,
          low: 68000,
          close: 68500,
        })
        return
      }

      const candle = param.seriesData.get(candleSeries)

      if (!candle || !('open' in candle)) {
        return
      }

      setOhlc({
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      })
    })

    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth
      const height = container.clientHeight

      if (width > 0 && height > 0) {
        chart.applyOptions({ width, height })
      }
    })

    resizeObserver.observe(container)


    return () => {
      resizeObserver.disconnect()
      chart.remove()
    }
  }, [candleData, executions, showMarkers])

  return (
    <div className="chart-wrapper">
      <div className="chart-controls">
        <button
          onClick={() => setShowMarkers(!showMarkers)}
          disabled={executions.length === 0}
        >
          {showMarkers ? 'Hide Buy/Sell' : 'Show Buy/Sell'}
        </button>
      </div>
      <div className="ohlc-row">
        <span className="ohlc-open">O: {ohlc.open}</span>
        <span className="ohlc-high">H: {ohlc.high}</span>
        <span className="ohlc-low">L: {ohlc.low}</span>
        <span className="ohlc-close">C: {ohlc.close}</span>
      </div>

      <div
        className="candlestick-chart"
        ref={chartContainerRef}
        style={{ width: '100%', height: '100%' }}
      />
  </div>
  )
}

export default CandlestickChart