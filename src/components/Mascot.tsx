export default function Mascot() {
  return (
    <svg className="mascot" viewBox="0 0 260 280" role="img" aria-label="Çilek tutan tavşan maskotu">
          <g fill="#fff" stroke="#8C6574" strokeWidth="5" strokeLinejoin="round">
            <ellipse cx="92" cy="62" rx="28" ry="52" transform="rotate(-8 92 62)"/><ellipse cx="168" cy="62" rx="28" ry="52" transform="rotate(8 168 62)"/>
            <ellipse cx="130" cy="150" rx="92" ry="80"/><ellipse cx="130" cy="236" rx="62" ry="40"/>
          </g>
          <ellipse cx="92" cy="66" rx="12" ry="30" fill="#FFD0DB" transform="rotate(-8 92 66)"/><ellipse cx="168" cy="66" rx="12" ry="30" fill="#FFD0DB" transform="rotate(8 168 66)"/>
          <circle cx="82" cy="160" r="17" fill="#FFC6D3" opacity=".8"/><circle cx="178" cy="160" r="17" fill="#FFC6D3" opacity=".8"/>
          <circle cx="102" cy="142" r="6" fill="#8C6574"/><circle cx="158" cy="142" r="6" fill="#8C6574"/>
          <path d="M124 154 130 160 136 154Z" fill="#8C6574"/>
          <path d="M130 196C108 196 104 228 130 244 156 228 152 196 130 196Z" fill="#E8466C" stroke="#8C6574" strokeWidth="4"/>
          <path d="M116 196 130 184 144 196Z" fill="#6FA35B"/>
          <use href="#bow" x="54" y="86" width="40" height="40"/>
          <use href="#star" x="10" y="34" width="26" height="26" className="tw"/><use href="#star" x="222" y="96" width="22" height="22" className="tw" style={{animationDelay:'1.4s'}}/><use href="#gem" x="216" y="206" width="30" height="30" className="tw" style={{animationDelay:'.7s'}}/><use href="#heart" x="8" y="214" width="26" height="26" className="tw" style={{animationDelay:'2s'}}/>
        </svg>
  )
}
