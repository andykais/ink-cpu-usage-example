import * as os from 'os'
import { useState } from 'react'

const useMemoryUsage = () => {
  const [state, setState] = useState({ total: 0, used: 0, percent: 0 })
  const setMemory = () => {
    const total = os.totalmem() / 1e9
    const used = total - os.freemem() / 1e9
    const percent = (used / total) * 100
    setState({ total, used, percent })
  }

  return [state, setMemory] as [typeof state, typeof setMemory]
}

type CpuChange = os.CpuInfo & { percent: number }
const useCpuUsage = () => {
  const [state, setState] = useState<CpuChange[]>([])

  const setCpuUsage = () => {
    setState(prevCpuUsage => {
      const cores = os.cpus() as CpuChange[]

      for (let i = 0; i < cores.length; i++) {
        const core = cores[i]
        const prevCore = prevCpuUsage[i]

        const coreChanged: os.CpuInfo['times'] = prevCore
          ? Object.keys(core.times).reduce(
              (acc, key: keyof os.CpuInfo['times']) => ({
                ...acc,
                [key]: core.times[key] - prevCore.times[key]
              }),
              {} as os.CpuInfo['times']
            )
          : core.times

        const { user, nice, idle, irq, sys } = coreChanged
        core.percent = (user + nice + irq + sys) / (user + nice + idle + irq + sys)
      }
      return cores
    })
  }
  return [state, setCpuUsage] as [typeof state, typeof setCpuUsage]
}

export { useMemoryUsage, useCpuUsage }
