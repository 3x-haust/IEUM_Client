import { z } from 'zod';
import { API_BASE_URL } from '@/data';
import { buildApiUrl } from './apiUrl';
import { apiResponseSchema } from './ieumSchemas';

export async function requestData<TSchema extends z.ZodType>(
  path: string,
  schema: TSchema,
  init?: RequestInit,
): Promise<z.infer<TSchema>> {
  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/json');
  if (!(init?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  const response = await fetch(buildApiUrl(API_BASE_URL, path), {
    ...init,
    headers,
  });
  const payload: unknown = await response.json();
  if (!response.ok) {
    throw new Error(readErrorMessage(payload) ?? `API request failed: ${response.status}`);
  }
  const wrapped = apiResponseSchema.parse(payload);
  return schema.parse(wrapped.data);
}

function readErrorMessage(payload: unknown): string | null {
  const parsed = z.object({ message: z.union([z.string(), z.array(z.string())]).optional() }).safeParse(payload);
  if (!parsed.success || !parsed.data.message) return null;
  return Array.isArray(parsed.data.message)
    ? parsed.data.message.join('\n')
    : parsed.data.message;
}
