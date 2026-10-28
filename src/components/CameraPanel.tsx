import type { Camera } from '../hooks/useCamera'
import type { Box } from '../hooks/usePhoneDetector'

const MESSAGES: Record<string, string> = {
  idle: 'Kamera kapalı.',
  requesting: 'Kamera izni bekleniyor. Tarayıcının sorusunu onayla.',
  denied: 'Kamera izni verilmedi. Adres çubuğundaki kilit simgesinden izin verip tekrar dene. Zamanlayıcı kamerasız da çalışır.',
  unsupported: 'Bu cihazda kullanılabilir bir kamera bulunamadı.',
  error: 'Kamera açılamadı. Başka bir uygulama kamerayı kullanıyor olabilir.',
}

export default function CameraPanel({ camera, boxes }: { camera: Camera; boxes: Box[] }) {
  const live = camera.state === 'on'
  return (
    <div className={'glass cam' + (live ? ' live' : '')}>
      <video ref={camera.attachVideo} playsInline muted style={{ display: live ? 'block' : 'none' }} />
      {live && (
        <div className="boxes" aria-hidden="true">
          {boxes.map((b, i) => (
            <div key={i} className="box" style={{ left: `${b.x * 100}%`, top: `${b.y * 100}%`, width: `${b.w * 100}%`, height: `${b.h * 100}%` }}>
              <span>telefon %{Math.round(b.score * 100)}</span>
            </div>
          ))}
        </div>
      )}
      {!live && (
        <div>
          <p>{MESSAGES[camera.state]}</p>
          {(camera.state === 'denied' || camera.state === 'error' || camera.state === 'idle') && (
            <button className="btn soft" onClick={camera.start}>Kamerayı aç</button>
          )}
        </div>
      )}
    </div>
  )
}
