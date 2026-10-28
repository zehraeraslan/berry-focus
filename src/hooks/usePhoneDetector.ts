import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import type { ObjectDetector } from '@mediapipe/tasks-vision'
import { smooth } from '../lib/alertLevel'

// Model ve WASM dosyaları tarayıcıya indirilir; kamera görüntüsü hiçbir yere gönderilmez.
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/wasm'
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite'
const INTERVAL_MS = 200 // saniyede ~5 analiz: laptopu yormaz, uyarı için yeterince hızlı

export type DetectorState = 'off' | 'loading' | 'ready' | 'error'
/** Kutu koordinatları 0-1 aralığında oran olarak tutulur. */
export type Box = { x: number; y: number; w: number; h: number }

export function usePhoneDetector(videoRef: MutableRefObject<HTMLVideoElement | null>, active: boolean) {
  const [state, setState] = useState<DetectorState>('off')
  const [phone, setPhone] = useState(false)
  const [boxes, setBoxes] = useState<Box[]>([])
  const detectorRef = useRef<ObjectDetector | null>(null)
  const history = useRef<boolean[]>([])

  // Modeli ilk gerektiğinde yükle (sayfa açılışını yavaşlatmaz).
  useEffect(() => {
    if (!active || detectorRef.current) return
    let cancelled = false
    setState('loading')
    ;(async () => {
      try {
        const mp = await import('@mediapipe/tasks-vision')
        const vision = await mp.FilesetResolver.forVisionTasks(WASM_URL)
        const make = (delegate: 'GPU' | 'CPU') =>
          mp.ObjectDetector.createFromOptions(vision, {
            baseOptions: { modelAssetPath: MODEL_URL, delegate },
            runningMode: 'VIDEO',
            scoreThreshold: 0.35,
            maxResults: 5,
            categoryAllowlist: ['cell phone'],
          })
        let detector: ObjectDetector
        try {
          detector = await make('GPU')
        } catch {
          detector = await make('CPU')
        }
        if (cancelled) {
          detector.close()
          return
        }
        detectorRef.current = detector
        setState('ready')
      } catch {
        if (!cancelled) setState('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [active])

  // Analiz döngüsü
  useEffect(() => {
    if (!active || state !== 'ready') {
      history.current = []
      setPhone(false)
      setBoxes((prev) => (prev.length ? [] : prev))
      return
    }
    let stopped = false
    let timer = 0
    const loop = () => {
      if (stopped) return
      const video = videoRef.current
      const detector = detectorRef.current
      if (video && detector && video.readyState >= 2 && video.videoWidth > 0) {
        try {
          const result = detector.detectForVideo(video, performance.now())
          const found: Box[] = result.detections.flatMap((d) =>
            d.boundingBox
              ? [{
                  x: d.boundingBox.originX / video.videoWidth,
                  y: d.boundingBox.originY / video.videoHeight,
                  w: d.boundingBox.width / video.videoWidth,
                  h: d.boundingBox.height / video.videoHeight,
                }]
              : [],
          )
          history.current.push(found.length > 0)
          if (history.current.length > 10) history.current.shift()
          setPhone(smooth(history.current))
          setBoxes((prev) => (prev.length === 0 && found.length === 0 ? prev : found))
        } catch {
          /* tek bir kare hatası döngüyü durdurmasın */
        }
      }
      timer = window.setTimeout(loop, INTERVAL_MS)
    }
    loop()
    return () => {
      stopped = true
      clearTimeout(timer)
    }
  }, [active, state, videoRef])

  useEffect(
    () => () => {
      detectorRef.current?.close()
      detectorRef.current = null
    },
    [],
  )

  return { state, phone, boxes }
}
