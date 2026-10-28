import { useCallback, useEffect, useRef, useState } from 'react'

export type CameraState = 'idle' | 'requesting' | 'on' | 'denied' | 'unsupported' | 'error'

export function useCamera() {
  const [state, setState] = useState<CameraState>('idle')
  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const bind = useCallback(() => {
    const el = videoRef.current
    if (el && streamRef.current && el.srcObject !== streamRef.current) {
      el.srcObject = streamRef.current
      void el.play().catch(() => {})
    }
  }, [])

  /** <video ref={camera.attachVideo}> olarak kullanılır; video sonradan oluşsa bile akışı bağlar. */
  const attachVideo = useCallback(
    (el: HTMLVideoElement | null) => {
      videoRef.current = el
      bind()
    },
    [bind],
  )

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setState('idle')
  }, [])

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState('unsupported')
      return
    }
    setState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream
      setState('on')
    } catch (e) {
      const name = (e as DOMException).name
      if (name === 'NotAllowedError' || name === 'SecurityError') setState('denied')
      else if (name === 'NotFoundError' || name === 'OverconstrainedError') setState('unsupported')
      else setState('error')
    }
  }, [])

  useEffect(() => {
    if (state === 'on') bind()
  }, [state, bind])

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), [])

  return { state, start, stop, attachVideo, videoRef }
}

export type Camera = ReturnType<typeof useCamera>
