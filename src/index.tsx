import * as React from 'react'
import { render, Color, Box } from 'ink'
import { useKeyPress } from './hooks/use-key-press'
import { useInterval } from './hooks/use-interval'
import { useMemoryUsage } from './hooks/use-memory'
import { useCpuUsage } from './hooks/use-cpu-usage'

const GraphColumn = ({
  percent,
  xLabel,
  yLabel,
  fineness,
  sigfigs
}: {
  percent: number
  xLabel: string
  yLabel: string
  fineness: number
  sigfigs: number
}) => {
  const barCells = Array(fineness)
  for (let i = 0; i <= fineness; i++) {
    if ((fineness - i) / fineness <= percent) {
      barCells[i] = ':'
    } else {
      barCells[i] = ' '
    }
  }
  const percentage = percent * 100

  return (
    <div>
      {barCells.map((cell, index) => (
        <div key={index}>{`|${cell.repeat(sigfigs + 3)}|`}</div>
      ))}
      <span>{percentage.toFixed(sigfigs).padStart(sigfigs + 3) + '%'}</span>
    </div>
  )
}

const useIndex = () => {
  const [state, setState] = React.useState(0)
  const setIndex = () => {
    setState(state + 1)
  }
  return [state, setIndex] as [number, typeof setIndex]
}

const MemoryUsage = () => {
  const [cpuCores, setCpuUsage] = useCpuUsage()
  useInterval(() => {
    setCpuUsage()
  }, 1000)

  return (
    <Box>
      {cpuCores.map((core, i) => (
        <GraphColumn
          key={i}
          fineness={10}
          sigfigs={4}
          xLabel="memory usage"
          yLabel="percentage"
          percent={core.percent}
        />
      ))}
      {/* <div>{memory.percent}</div> */}
      {/* <div>{memory.used}</div> */}
      {/* <div>{memory.total}</div> */}
    </Box>
  )
}

render(<MemoryUsage />)
