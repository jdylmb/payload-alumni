import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json()
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const subject = typeof body?.subject === 'string' ? body.subject.trim() : ''
    const message = typeof body?.message === 'string' ? body.message.trim() : ''

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'contact-submissions',
      // Anonymous submission — honour the collection's `create: anyone` access.
      overrideAccess: false,
      data: { name, email, subject, message },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'Submission failed.'
    return NextResponse.json({ error: errMessage }, { status: 500 })
  }
}
