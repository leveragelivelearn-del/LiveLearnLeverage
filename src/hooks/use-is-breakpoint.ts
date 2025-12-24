"use client"

import { useCallback, useSyncExternalStore } from "react"

type BreakpointMode = "min" | "max"

/**
 * Hook to detect whether the current viewport matches a given breakpoint rule.
 * Example:
 * useIsBreakpoint("max", 768)   // true when width < 768
 * useIsBreakpoint("min", 1024)  // true when width >= 1024
 */
export function useIsBreakpoint(
  mode: BreakpointMode = "max",
  breakpoint = 768
) {
  // Construct the media query string
  const query =
    mode === "min"
      ? `(min-width: ${breakpoint}px)`
      : `(max-width: ${breakpoint - 1}px)`

  // 1. Subscribe function for useSyncExternalStore
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", callback)
      return () => mql.removeEventListener("change", callback)
    },
    [query]
  )

  // 2. Client snapshot (runs in browser)
  const getSnapshot = () => {
    return window.matchMedia(query).matches
  }

  // 3. Server snapshot (runs during SSR)
  const getServerSnapshot = () => {
    return false // Default to false on the server to match initial !!undefined behavior
  }

  // useSyncExternalStore handles the hydration mismatch and updates automatically
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}