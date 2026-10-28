type Props = { progress: number }

export default function Berry({ progress }: Props) {
  const y = 230 - 226 * Math.min(1, Math.max(0, progress))
  return (
    <svg className="berry" viewBox="0 0 200 230" role="img" aria-label="Çilek ilerleme göstergesi">
          <defs><clipPath id="clip"><path id="bp" d="M100 44C155 38 190 72 178 128 166 182 126 214 100 220 74 214 34 182 22 128 10 72 45 38 100 44Z"/></clipPath></defs>
          <use href="#bp" fill="#FFD0DB"/>
          <rect id="fill" x="0" y={y} width="200" height="230" fill="#E8466C" clipPath="url(#clip)"/>
          <use href="#bp" fill="none" stroke="#fff" strokeWidth="5" opacity=".8"/>
          <g fill="#fff" opacity=".7"><circle cx="70" cy="90" r="4"/><circle cx="125" cy="80" r="3"/><circle cx="95" cy="130" r="4"/><circle cx="140" cy="140" r="3"/><circle cx="65" cy="165" r="3"/></g>
          <ellipse cx="62" cy="100" rx="9" ry="22" fill="#fff" opacity=".55" transform="rotate(18 62 100)"/>
          <use href="#star" x="150" y="70" width="20" height="20" className="tw"/><use href="#star" x="40" y="150" width="14" height="14" className="tw" style={{animationDelay:'1.3s'}}/><use href="#star" x="110" y="150" width="16" height="16" className="tw" style={{animationDelay:'2.2s'}}/>
          <path d="M100 48 62 14 94 30 100 4 106 30 138 14Z" fill="#6FA35B" stroke="#fff" strokeWidth="3" strokeLinejoin="round"/>
        </svg>
  )
}
