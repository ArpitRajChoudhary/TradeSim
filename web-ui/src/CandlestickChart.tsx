import { useEffect, useRef } from 'react'
import { createChart, CandlestickSeries } from 'lightweight-charts'


function CandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const container = chartContainerRef.current

    if (!container) {
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

    candleSeries.setData([
      { time: '2026-10-19', open: 67000, high: 68500, low: 66500, close: 68000 },
      { time: '2026-10-20', open: 68000, high: 69000, low: 67500, close: 67800 },
      { time: '2026-10-21', open: 67800, high: 70000, low: 67700, close: 69500 },
      { time: '2026-10-22', open: 69500, high: 70500, low: 68800, close: 70000 },
      { time: '2026-10-23', open: 70000, high: 70200, low: 68000, close: 68500 },
    ])
    chart.timeScale().fitContent()

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
  }, [])

  return (
    <div className="chart-wrapper">
      <div className="ohlc-row">
        <span>O: —</span>
        <span>H: —</span>
        <span>L: —</span>
        <span>C: —</span>
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