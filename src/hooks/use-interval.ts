import { useRef, useEffect, useState } from 'react'

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<() => void>(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = () => savedCallback.current()
    const intervalId = setInterval(tick, delay)
    return () => clearInterval(intervalId)
  }, [delay])
}

export { useInterval }
