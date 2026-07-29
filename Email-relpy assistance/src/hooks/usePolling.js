import { useState, useEffect, useCallback, useRef } from 'react'
import { POLL_INTERVAL } from '../config'

export function usePolling(fetchFn, interval = POLL_INTERVAL) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fetchRef = useRef(fetchFn)
  fetchRef.current = fetchFn

  const run = useCallback(async () => {
    try {
      const result = await fetchRef.current()
      setData(Array.isArray(result) ? result : result?.data ?? [])
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    run()
    const id = setInterval(run, interval)
    return () => clearInterval(id)
  }, [run, interval])

  return { data, loading, error, refresh: run }
}
