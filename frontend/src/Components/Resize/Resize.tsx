import React, { useEffect, useRef } from 'react'
import { ResizeObserver } from '@juggle/resize-observer'

export default function Resize({
  children,
  onChangeHeight,
}: {
  children: React.ReactNode
  onChangeHeight: (height: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkHeight()
    if (ref.current) {
      const resizeObserver: ResizeObserver = new ResizeObserver(checkHeight)
      resizeObserver.observe(ref.current)
      return () => {
        resizeObserver.disconnect()
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const checkHeight = () => {
    if (ref.current) onChangeHeight(ref.current.clientHeight)
  }

  return <div ref={ref}>{children}</div>
}
