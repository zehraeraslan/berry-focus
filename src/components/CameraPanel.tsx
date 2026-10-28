import type { Camera } from '../hooks/useCamera'

const MESSAGES: Record<string, string> = {
  idle: 'Kamera kapalı.',
  requesting: 'Kamera izni bekleniyor. Tarayıcının sorusunu onayla.',
  denied: 'Kamera izni verilmedi. Adres çubuğundaki kilit simgesinden izin verip tekrar dene. Zamanlayıcı kamerasız da çalışır.',
  unsupported: 'Bu cihazda kullanılabilir bir kamera bulunamadı.',
  error: 'Kamera açılamadı. Başka bir uygulama kamerayı kullanıyor olabilir.',
}

export default function CameraPanel({ camera }: { camera: Camera }) {
  const live = camera.state === 'on'
  return (
    <div className={'glass cam' + (live ? ' live' : '')}>
      <video ref={camera.attachVideo} playsInline muted style={{ display: live ? 'block' : 'none' }} />
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
