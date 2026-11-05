export const waitlistVerticals = ['Gaming', 'Tech', 'Music', 'Lifestyle', 'Streaming', 'Creator'] as const
export type WaitlistVertical = typeof waitlistVerticals[number]

export interface WaitlistSignup {
  fullName: string
  email: string
  gamerTag?: string
  primaryVertical: WaitlistVertical
}

interface SignupResult {
  id: string
  email: string
  message: string
}

export async function joinWaitlist(signup: WaitlistSignup): Promise<SignupResult> {
  // Call the API from the browser so RemoteIpAddress remains per visitor.
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === 'development' ? 'http://localhost:5080' : '')).replace(/\/+$/, '')
  if (!baseUrl) throw new Error('Waitlist signups are temporarily unavailable. Please try again later.')

  let response: Response
  try {
    response = await fetch(`${baseUrl}/api/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify(signup),
      signal: AbortSignal.timeout(30000),
    })
  } catch {
    throw new Error('We could not confirm your signup. Please check your connection and try again.')
  }

  const payload: unknown = await response.json().catch(() => null)
  const envelope = payload && typeof payload === 'object' ? payload as Record<string, unknown> : null
  const data = envelope?.data && typeof envelope.data === 'object'
    ? envelope.data as Record<string, unknown> : null

  if (response.status === 201 && envelope?.success === true &&
      typeof data?.id === 'string' && typeof data.email === 'string') {
    return { id: data.id, email: data.email, message: typeof data.message === 'string' ? data.message : "You're on the list!" }
  }
  if (response.status === 409) throw new Error('This email is already on the waitlist.')
  if (response.status === 429) throw new Error('Too many signup attempts. Please try again later.')
  if (response.status === 400) {
    const errors = Array.isArray(envelope?.errors)
      ? envelope.errors.filter((error): error is string => typeof error === 'string') : []
    throw new Error(errors.length ? errors.join('\n') : 'Please check your details and try again.')
  }
  throw new Error('Waitlist signups are temporarily unavailable. Please try again later.')
}
