import * as readline from 'readline'
import { useState, useEffect } from 'react'

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode!(true)

const useKeyPress = (targetKey: string) => {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false)

  // If pressed key is our target key then set to true
  const downHandler = (str: any, key: { name: string; ctrl: boolean }) => {
    if (key.ctrl && key.name === 'c') {
      process.stdin.setRawMode!(false)
      process.exit()
    }

    if (str === targetKey) {
      setKeyPressed(true)
    }
  }

  // If released key is our target key then set to false
  const upHandler = (str: any, key: string) => {
    if (key === targetKey) {
      setKeyPressed(false)
    }
  }

  // Add event listeners
  useEffect(() => {
    process.stdin.on('keypress', downHandler)
    return () => {
      process.stdin.removeListener('keypress', downHandler)
    }
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return keyPressed
}

export { useKeyPress }
