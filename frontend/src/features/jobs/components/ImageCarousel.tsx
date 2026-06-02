import { useState } from 'react'

interface Props {
  images: string[]
}

export default function ImageCarousel({ images }: Props) {
  const [index, setIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div style={{
        height: 220,
        backgroundColor: 'rgba(28,27,27,0.04)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(28,27,27,0.3)',
        fontSize: '0.875rem',
      }}>
        No images uploaded
      </div>
    )
  }

  const prev = () => setIndex(i => (i - 1 + images.length) % images.length)
  const next = () => setIndex(i => (i + 1) % images.length)

  const btnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(28,27,27,0.55)',
    color: 'var(--c-light)',
    border: 'none',
    borderRadius: 6,
    width: 32,
    height: 32,
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  }

  return (
    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', backgroundColor: '#000' }}>
      <img
        src={images[index]}
        alt={`Shipment image ${index + 1}`}
        style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
      />

      {images.length > 1 && (
        <>
          <button onClick={prev} style={{ ...btnStyle, left: 8 }} aria-label="Previous image">‹</button>
          <button onClick={next} style={{ ...btnStyle, right: 8 }} aria-label="Next image">›</button>
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 5,
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Image ${i + 1}`}
                style={{
                  width: i === index ? 18 : 7,
                  height: 7,
                  borderRadius: 4,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: i === index ? 'var(--c-light)' : 'rgba(243,243,243,0.45)',
                  padding: 0,
                  transition: 'width 0.2s',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
