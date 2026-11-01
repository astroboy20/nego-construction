import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'NEGO Construction Limited'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#004b22',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: '#22c55e',
          }}
        />

        {/* Company name mark */}
        <div
          style={{
            position: 'absolute',
            top: '72px',
            left: '80px',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#22c55e',
          }}
        >
          NEGO
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            maxWidth: '900px',
            marginBottom: '32px',
          }}
        >
          NEGO Construction Limited
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '26px',
            fontWeight: 400,
            lineHeight: 1.4,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: '700px',
          }}
        >
          Infrastructure, residential &amp; commercial projects across Nigeria — built with clarity, care and craft.
        </div>

        {/* URL badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '72px',
            right: '80px',
            fontSize: '18px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.04em',
          }}
        >
          negoconstruction.com
        </div>
      </div>
    ),
    { ...size }
  )
}
