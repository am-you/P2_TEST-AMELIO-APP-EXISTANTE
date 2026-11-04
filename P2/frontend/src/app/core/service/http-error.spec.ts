import { HttpErrorResponse } from '@angular/common/http';
import { readServerError } from './http-error';

// Am.Yo : message, texte brut, ou repli
describe('readServerError', () => {
  it('reads a JSON message, a detail, or the raw text', () => {
    expect(readServerError(error('{"message":"Invalid credentials"}'))).toBe('Invalid credentials');
    expect(readServerError(error('{"detail":"missing"}'))).toBe('missing');
    expect(readServerError(error('{"other":1}'))).toBe('{"other":1}');
    expect(readServerError(error('plain error'))).toBe('plain error');
  });

  it('reads an object body or a default message', () => {
    expect(readServerError(error({ message: 'taken' }))).toBe('taken');
    expect(readServerError(error({ detail: 'nope' }))).toBe('nope');
    expect(readServerError(error({}))).toBe('Request failed');
    expect(readServerError(error('   '))).toBe('Request failed');
    expect(readServerError(error(null))).toBe('Request failed');
  });
});

function error(body: unknown): HttpErrorResponse {
  return new HttpErrorResponse({ error: body, status: 400 });
}
