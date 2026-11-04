import { HttpErrorResponse } from '@angular/common/http';

// Am.Yo : lit le message d'erreur renvoyé par le back
export function readServerError(error: HttpErrorResponse): string {
  const body = error.error;
  if (typeof body === 'string' && body.trim()) {
    try {
      const parsed = JSON.parse(body) as { message?: string; detail?: string };
      return parsed.message || parsed.detail || body;
    } catch {
      return body;
    }
  }
  if (body && typeof body === 'object') {
    const details = body as { message?: string; detail?: string };
    return details.message || details.detail || 'Request failed';
  }
  return 'Request failed';
}
