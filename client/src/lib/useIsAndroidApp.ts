import { useEffect, useState } from "react"

export function useIsAndroidApp() {
  const [isAndroidApp, setIsAndroidApp] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAndroid = window.location.protocol === "capacitor:"
      setIsAndroidApp(isAndroid)
    }
  }, [])

  return isAndroidApp
}