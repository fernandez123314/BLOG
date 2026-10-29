
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Camera,
  Cloud,
  Edit3,
  ExternalLink,
  Heart,
  ImagePlus,
  Link2,
  LockKeyhole,
  Music2,
  Pause,
  Play,
  Quote,
  Sparkles,
  Sun,
  ThermometerSnowflake,
  Upload,
  Volume2,
  VolumeX,
  Wind,
  X,
} from 'lucide-react'

const moods = [
  { label: 'Días soleados', icon: Sun, note: 'Para cuando el mundo se ilumina contigo.', color: 'gold' },
  { label: 'Días fríos', icon: ThermometerSnowflake, note: 'Un abrazo escrito para abrigarte.', color: 'ice' },
  { label: 'Cuando estés triste', icon: Cloud, note: 'Recuerda: nunca estás sola en esto.', color: 'lavender' },
  { label: 'Cuando estés feliz', icon: Sparkles, note: 'Que tu sonrisa se quede un rato más.', color: 'mint' },
]

const defaultPhotos = [
  { src: '/02.png', caption: 'Donde todo comenzó' },
  { src: '/romantic-memory-cover.png', caption: 'Un instante para guardar' },
  { src: '/romantic-memory-cover.png', caption: 'Tú, siempre tú' },
]

export default function Page() {
  const [activePage, setActivePage] = useState(0)
  const [soundOn, setSoundOn] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedNotice, setSavedNotice] = useState('')
  const [greeting, setGreeting] = useState('Hola, SAI ♥')
  const [message, setMessage] = useState(
    'Desde que llegaste, los días tienen otra luz.\n\nGracias por cada risa, cada conversación y cada pequeño momento que se vuelve enorme cuando es contigo.\n\nEste rincón es para guardar todo lo que siento por ti, sin prisa y para siempre.'
  )
  const songUrl = 'https://youtu.be/yvpugzD3NVw'
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [photos, setPhotos] = useState(defaultPhotos)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/memory')
      .then((response) => response.json())
      .then((data) => {
        setGreeting(data.greeting ?? 'Hola, SAI ♥')
        setMessage(data.message ?? message)
        
      })
      .catch(() => undefined)
  }, [])

  const saveChanges = async () => {
    setIsSaving(true)

    try {
      await fetch('/api/memory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ greeting, message, songUrl }),
      })

      setSavedNotice('SONRIE')
      setIsEditing(false)
      window.setTimeout(() => setSavedNotice(''), 3200)
    } finally {
      setIsSaving(false)
    }
  }

  const next = () => setActivePage((page) => Math.min(page + 1, 3))
  const previous = () => setActivePage((page) => Math.max(page - 1, 0))

  useEffect(() => {
    const handler = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 20) return
      if (event.deltaY > 0) next()
      else previous()
    }

    window.addEventListener('wheel', handler, { passive: true })
    return () => window.removeEventListener('wheel', handler)
  }, [])

  const progress = useMemo(() => `${(activePage / 3) * 100}%`, [activePage])

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith('image/')
    )

    const nextPhotos = files.map((file) => ({
      src: URL.createObjectURL(file),
      caption: file.name.replace(/\.[^/.]+$/, ''),
    }))

    setPhotos((current) => [...current, ...nextPhotos])
  }

  // Abre la misma canción en YouTube desde el botón de Play.
  // La apertura ocurre directamente como respuesta al toque del usuario.
  const openSong = () => {
    const url = songUrl.trim() || 'https://youtu.be/yvpugzD3NVw'
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="memory-app">
      <div className="grain" aria-hidden="true" />

      <header className="topbar">
        <a
          className="brand"
          href="#inicio"
          onClick={() => setActivePage(0)}
        >
          <span className="brand-mark">
            <Heart fill="currentColor" />
          </span>
          <span>
            <strong>bloc de recuerdos</strong>
            <small>un lugar para no </small>
          </span>
        </a>

        <div className="top-actions">
          <button
            className="icon-button"
            aria-label={soundOn ? 'Silenciar sonidos' : 'Activar sonidos'}
            onClick={() => setSoundOn(!soundOn)}
          >
            {soundOn ? <Volume2 /> : <VolumeX />}
          </button>

          <button
            className="edit-button"
            onClick={isEditing ? saveChanges : () => setIsEditing(true)}
          >
            <Edit3 />
            {isSaving
              ? 'Guardando…'
              : isEditing
                ? 'Guardar cambios'
                : 'Editar bloc'}
          </button>
        </div>
      </header>

      <div className="stage" id="inicio">
        <aside className="side-note left-note">
          <span>para ti, con cariño</span>
          <i />
        </aside>

        <div className="page-count">
          <span>0{activePage + 1}</span>
          <i />
          04
        </div>

        <section
          className={`memory-page page-${activePage}`}
          aria-live="polite"
        >
          {/* CAPÍTULO 1: BIENVENIDA */}

          {activePage === 0 && (
            <div className="welcome-page">
              <div className="eyebrow">
                <span className="dot" />
                capítulo uno · el comienzo
              </div>

              <div className="welcome-grid">
                <div className="welcome-copy">
                  <p className="script">
                    para la persona que hace hogar en mi corazón
                  </p>

                  <h1>
                    Hola,
                    <br />
                    <em>{greeting.replace('Hola, ', '')}</em>
                  </h1>

                  {isEditing ? (
                    <textarea
                      className="message-editor"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      aria-label="Mensaje de bienvenida editable"
                    />
                  ) : (
                    <div className="message-copy">
                      {message.split('\n').map((line, index) =>
                        line ? (
                          <p key={index}>{line}</p>
                        ) : (
                          <br key={index} />
                        )
                      )}
                    </div>
                  )}

                  <div className="signature">
                    <span>Con todo mi cariño,</span>
                    <strong>Siempre tuyo</strong>
                  </div>
                </div>

                <div className="cover-wrap">
                  <div className="photo-frame">
                    <img
                      src="/02.png"
                      alt="Dos siluetas tomadas de la mano durante un atardecer"
                    />
                    <span className="photo-caption">
                      nuestro primer capítulo
                    </span>
                  </div>

                  <div className="stamp">
                    <Heart fill="currentColor" />
                    <span>
                      hecho
                      <br />
                      para ti
                    </span>
                  </div>
                </div>
              </div>

              <button className="continue-button" onClick={next}>
                seguir leyendo <ArrowDown />
              </button>
            </div>
          )}

          {/* CAPÍTULO 2: CANCIÓN */}

          {activePage === 1 && (
            <div className="music-page">
              <div className="eyebrow">
                <span className="dot" />
                capítulo dos · una canción que describe lo que siento por ti
              </div>

              <div className="music-layout">
                <div className="record-art">
                  <div className="record">
                    <div className="record-label">
                      <Heart fill="currentColor" />
                      <span>tú + yo</span>
                    </div>
                  </div>
                  <div className="record-shadow" />
                </div>

                <div className="music-copy">
                  <p className="script">
                    si tuviera que elegir una canción
                  </p>

                  <h2>
                    Lo que siento
                    <br />
                    <em>por ti.</em>
                  </h2>

                  <p className="muted-copy">
                    Hay canciones que no se escuchan, se sienten. Esta me
                    recuerda a nosotros o expresa jajaja.
                  </p>

                  <div className="track">
                    <div className="track-icon">
                      <Music2 />
                    </div>

                    <div className="track-info">
                      <strong>La canción que me lleva a ti</strong>
                      <span>My Favorite Part · wiiii</span>
                    </div>

                    {/* PLAY: abre la misma canción que el enlace de abajo */}
                    <button
                      className="play-button"
                      onClick={openSong}
                      aria-label="Reproducir canción en YouTube"
                      type="button"
                    >
                      <Play fill="currentColor" />
                    </button>
                  </div>

                  {/* ENLACE: utiliza exactamente la misma URL */}
                  <a
                    className="song-link"
                    href={songUrl.trim() || 'https://youtu.be/yvpugzD3NVw'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Link2 />
                    abrir en YouTube
                    <ExternalLink />
                  </a>

                  {isEditing && (
                    <label className="song-editor">
                      Enlace de YouTube
                      <input
                        value={songUrl}
                        onChange={(event) => setSongUrl(event.target.value)}
                        placeholder="https://youtu.be/yvpugzD3NVw"
                        type="url"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CAPÍTULO 3: ESTADOS DE ÁNIMO */}

          {activePage === 2 && (
            <div className="moods-page">
              <div className="eyebrow">
                <span className="dot" />
                capítulo tres · para cada versión de ti
              </div>

              <div className="moods-heading">
                <div>
                  <p className="script">abre cuando lo necesites</p>
                  <h2>
                    Para tus
                    <br />
                    <em>días.</em>
                  </h2>
                </div>
                <Quote className="quote-icon" />
              </div>

              <div className="mood-grid">
                {moods.map(({ label, icon: Icon, note, color }) => (
                  <button
                    key={label}
                    className={`mood-card ${color}`}
                    onClick={() => setSelectedMood(label)}
                    title={note}
                  >
                    <span className="mood-icon">
                      <Icon />
                    </span>
                    <span className="mood-label">{label}</span>
                    <span className="mood-arrow">↗</span>
                  </button>
                ))}
              </div>
            </div>
          )}

         
        </section>

        <button
          className="nav-arrow prev"
          onClick={previous}
          disabled={activePage === 0}
          aria-label="Página anterior"
        >
          <ArrowLeft />
        </button>

        <button
          className="nav-arrow next"
          onClick={next}
          disabled={activePage === 3}
          aria-label="Página siguiente"
        >
          <ArrowRight />
        </button>
      </div>

      {savedNotice && <div className="saved-notice">{savedNotice}</div>}

      <footer className="footer">
        <span>hecho con cariño</span>

        <div className="progress">
          <i style={{ width: progress }} />
        </div>

        <span>
          {activePage + 1} / 4
        </span>
      </footer>

      {/* VENTANA DE MENSAJES */}

      
{selectedMood && (
  <div
    className="mood-modal"
    role="dialog"
    aria-modal="true"
    aria-label={selectedMood}
  >
    <div className="mood-modal-card">
      <button
        className="modal-close"
        onClick={() => setSelectedMood(null)}
        aria-label="Cerrar"
      >
        <X />
      </button>

      <p className="script">
        para {selectedMood.toLowerCase()}
      </p>

      <h2>
        {selectedMood === 'Días soleados'
          ? 'Qué bonito verte brillar.'
          : selectedMood === 'Días fríos'
            ? 'Ven, aquí tienes tu lugar.'
            : selectedMood === 'Cuando estés triste'
              ? 'Ojalá pudiera abrazarte ahora.'
              : 'Ojalá pudieras verte con mis ojos.'}
      </h2>

      <p className="modal-quote">
        {selectedMood === 'Días soleados'
          ? 'Si hoy el sol te parece más bonito y el mundo te regala motivos para sonreír, quiero que sepas algo: una de mis alegrías favoritas es imaginarte feliz. Guarda un poquito de esa luz para los días difíciles y recuerda que, entre todas las cosas bonitas de mi vida, tú eres una de mis favoritas. ❤️'
          : selectedMood === 'Días fríos'
            ? 'Si pudiera estar contigo ahora, no te escribiría mil palabras: te acercaría a mí, te abrazaría por la espalda y dejaría que el frío se quedara afuera. Porque hay lugares que abrigan por su temperatura y otros que abrigan porque alguien te quiere. Yo quisiera ser ese lugar para ti.'
            : selectedMood === 'Cuando estés triste'
              ? 'Amor, no tienes que fingir que estás bien conmigo. No necesitas encontrar las palabras correctas ni esconder lo que te duele. Si hoy el mundo pesa demasiado, descansa un ratito. Ojalá pudiera sentarme a tu lado, tomarte de la mano y recordarte bajito que no tienes que poder con todo para merecer amor. Si me necesitas, búscame. Incluso si no sabes qué decir, ven.'
              : 'Si pudieras mirarte por un instante a través de mis ojos, entenderías por qué me importan tanto tus pequeños gestos, tu manera de hablar, tus ocurrencias y hasta esas cosas de ti que quizá tú no notas. No tienes que ser perfecta para ser especial para mí. Y si alguna vez dudas de lo mucho que vales, recuerda que existe alguien que encuentra algo extraordinario en el simple hecho de que seas tú. Ese alguien soy yo. ❤️'}
      </p>

   
    </div>
  </div>
)}


    </main>
  )
}
