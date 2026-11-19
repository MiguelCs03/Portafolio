import { environment } from '../../environments/environment';

export function isApiConfigured(): boolean {
  return !!environment.apiUrl && !environment.apiUrl.includes('PEGA_AQUI');
}

export function getApiUrl(): string {
  return environment.apiUrl.replace(/\/+$/, '');
}
