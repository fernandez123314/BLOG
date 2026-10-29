import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const defaults = {
  greeting: 'Hola, SAI ♥',
  message: 'Desde que llegaste, los días tienen otra luz.\n\nGracias por cada risa, cada conversación y cada pequeño momento que se vuelve enorme cuando es contigo.\n\nEste rincón es para guardar todo lo que siento por ti, sin prisa y para siempre.',
  songUrl: 'https://www.youtube.com/results?search_query=cancion+de+amor',
}

async function ensureTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS memory_config (id integer PRIMARY KEY DEFAULT 1, greeting text NOT NULL, message text NOT NULL, song_url text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`)
}

export async function GET() {
  try {
    await ensureTable()
    const result = await pool.query('SELECT greeting, message, song_url AS "songUrl" FROM memory_config WHERE id = 1')
    if (!result.rows[0]) {
      await pool.query('INSERT INTO memory_config (greeting, message, song_url) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING', [defaults.greeting, defaults.message, defaults.songUrl])
      return NextResponse.json(defaults)
    }
    return NextResponse.json(result.rows[0])
  } catch {
    return NextResponse.json(defaults)
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const greeting = typeof body.greeting === 'string' ? body.greeting.slice(0, 100) : defaults.greeting
    const message = typeof body.message === 'string' ? body.message.slice(0, 4000) : defaults.message
    const songUrl = typeof body.songUrl === 'string' && /^https:\/\//.test(body.songUrl) ? body.songUrl.slice(0, 500) : defaults.songUrl
    await ensureTable()
    await pool.query('INSERT INTO memory_config (id, greeting, message, song_url) VALUES (1, $1, $2, $3) ON CONFLICT (id) DO UPDATE SET greeting = EXCLUDED.greeting, message = EXCLUDED.message, song_url = EXCLUDED.song_url, updated_at = now()', [greeting, message, songUrl])
    return NextResponse.json({ greeting, message, songUrl })
  } catch {
    return NextResponse.json({ error: 'No se pudieron guardar los cambios' }, { status: 500 })
  }
}
