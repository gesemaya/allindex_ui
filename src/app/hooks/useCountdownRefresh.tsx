import { useEffect, useState } from 'react'
import { useCountdown } from 'usehooks-ts'

interface ICountdownRefresh {
  initialCountDown?: number
}

export const useCountdownRefresh = (params: ICountdownRefresh) => {
  const { initialCountDown = 15 } = params
  const [count, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: initialCountDown,
    intervalMs: 1000,
  })

  const [countEnabled, setCountEnabled] = useState(false)

  const [countTriggered, setCountTriggered] = useState(0)

  useEffect(() => {
    if (countEnabled) {
      setCountTriggered(countTriggered + 1)
      resetCountdown()
      startCountdown()
    } else {
      stopCountdown()
    }
  }, [countEnabled])

  useEffect(() => {
    if (count === 0) {
      resetCountdown()
      startCountdown()
      setCountTriggered(countTriggered + 1)
    }
  }, [count])

  return {
    count,
    countEnabled,
    countTriggered,
    setCountEnabled,
  }
}
