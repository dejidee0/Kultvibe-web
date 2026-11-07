import type { components, paths } from '@/lib/api/types'

export type WaitlistSignup = components['schemas']['WaitlistSignupRequest']
type SignupEnvelope = paths['/api/waitlist']['post']['responses'][201]['content']['application/json']
export type WaitlistSignupResult = NonNullable<SignupEnvelope['data']>

// Retained until the registration UI switches to user types in B3.
export const waitlistVerticals = ['Gaming', 'Tech', 'Music', 'Lifestyle', 'Streaming', 'Creator'] as const
export type WaitlistVertical = typeof waitlistVerticals[number]

export class WaitlistApiError extends Error {
  readonly fieldErrors: Partial<Record<keyof WaitlistSignup, string>> = {}

  constructor(message: string, readonly status = 0, readonly errors: string[] = []) {
    super(message)
    this.name = 'WaitlistApiError'
    const fields: [RegExp, keyof WaitlistSignup][] = [
      [/full.?name/i, 'fullName'], [/email/i, 'email'], [/user.?type/i, 'userType'],
      [/company/i, 'companyName'], [/primary.?game|main game/i, 'primaryGame'],
      [/interest/i, 'interests'], [/gamer.?tag/i, 'gamerTag'],
    ]
    for (const error of errors) {
      const field = fields.find(([pattern]) => pattern.test(error))?.[1]
      if (field && !this.fieldErrors[field]) this.fieldErrors[field] = error
    }
  }
}

export async function joinWaitlist(signup: WaitlistSignup): Promise<WaitlistSignupResult> {
  // Browser requests preserve the API's per-visitor IP rate limit.
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === 'development' ? 'http://localhost:5080' : '')).replace(/\/+$/, '')
  if (!baseUrl) throw new WaitlistApiError('Waitlist signups are temporarily unavailable. Please try again later.')

  let response: Response
  try {
    response = await fetch(`${baseUrl}/api/waitlist`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit',
      body: JSON.stringify(signup), signal: AbortSignal.timeout(30000),
    })
  } catch {
    throw new WaitlistApiError('We could not confirm your signup. Please check your connection and try again.')
  }

  const raw: unknown = await response.json().catch(() => null)
  const envelope = raw && typeof raw === 'object' ? raw as Partial<SignupEnvelope> : null
  const data = envelope?.data
  if (response.status === 201 && envelope?.success === true &&
      typeof data?.id === 'string' && typeof data.email === 'string') {
    return { ...data, message: data.message || envelope.message || "You're on the list!" }
  }
  const message = typeof envelope?.message === 'string' ? envelope.message : ''
  if (response.status === 409) throw new WaitlistApiError(message || 'This email is already on the waitlist.', 409)
  if (response.status === 429) throw new WaitlistApiError(message || 'Too many signup attempts. Please try again later.', 429)
  if (response.status === 400) {
    const errors: unknown = envelope?.errors
    const values = Array.isArray(errors) ? errors : errors && typeof errors === 'object' ? Object.values(errors).flat() : []
    const messages = values.filter((error): error is string => typeof error === 'string')
    throw new WaitlistApiError(messages.join('\n') || message || 'Please check your details and try again.', 400, messages)
  }
  throw new WaitlistApiError('Waitlist signups are temporarily unavailable. Please try again later.', response.status)
}
