import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type Degree = { level: string; course?: string; yearGraduated?: string }

const str = (v: FormDataEntryValue | null): string | undefined => {
  if (typeof v !== 'string') return undefined
  const trimmed = v.trim()
  return trimmed.length ? trimmed : undefined
}

const bool = (v: FormDataEntryValue | null): boolean => v === 'on' || v === 'true'

export async function POST(req: Request): Promise<Response> {
  try {
    const formData = await req.formData()

    const fullName = str(formData.get('fullName'))
    const email = str(formData.get('email'))

    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Full name and email are required.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Upload proof of payment (if provided) as a trusted server-side media create.
    let proofOfPayment: number | undefined
    const file = formData.get('proofOfPayment')
    if (file && typeof file === 'object' && 'arrayBuffer' in file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const media = await payload.create({
        collection: 'media',
        data: { alt: `Proof of payment — ${fullName}` },
        file: {
          data: buffer,
          mimetype: file.type || 'application/octet-stream',
          name: file.name || 'proof-of-payment',
          size: file.size,
        },
        overrideAccess: true,
      })
      proofOfPayment = media.id
    }

    // Degrees come through as a JSON string.
    let degrees: Degree[] = []
    const degreesRaw = str(formData.get('degrees'))
    if (degreesRaw) {
      try {
        const parsed = JSON.parse(degreesRaw)
        if (Array.isArray(parsed)) {
          degrees = parsed.filter((d) => d && typeof d.level === 'string')
        }
      } catch {
        // ignore malformed degrees
      }
    }

    const amountRaw = str(formData.get('amount'))
    const amount = amountRaw ? Number(amountRaw) : undefined

    await payload.create({
      collection: 'alumni-registrations',
      // Anonymous submission — honour the collection's `create: anyone` access.
      overrideAccess: false,
      data: {
        fullName,
        email,
        phone: str(formData.get('phone')),
        dateOfBirth: str(formData.get('dateOfBirth')),
        sex: str(formData.get('sex')) as never,
        civilStatus: str(formData.get('civilStatus')) as never,
        nationality: str(formData.get('nationality')),
        currentAddress: str(formData.get('currentAddress')),
        permanentAddress: str(formData.get('permanentAddress')),
        degrees: degrees as { level: 'HS' | 'BS' | 'MS' | 'PhD'; course?: string; yearGraduated?: string }[],
        paymentMethod: str(formData.get('paymentMethod')) as never,
        referenceNumber: str(formData.get('referenceNumber')),
        amount: Number.isFinite(amount) ? amount : undefined,
        proofOfPayment,
        consent: {
          databaseEncoding: bool(formData.get('consent_databaseEncoding')),
          alumniId: bool(formData.get('consent_alumniId')),
          homecoming: bool(formData.get('consent_homecoming')),
          publication: bool(formData.get('consent_publication')),
          forwarding: bool(formData.get('consent_forwarding')),
        },
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Submission failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
