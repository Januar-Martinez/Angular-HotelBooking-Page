export function getApiError(err: any, fallback = 'Error inesperado'): string {
  return err?.error?.detail ?? fallback;
}