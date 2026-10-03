export interface Env {
  STORE_KV: KVNamespace;
  MEDIA_KV: KVNamespace;
  ASSETS: Fetcher;
  ENVIRONMENT: string;
  BUILD_SHA: string;
  ADMIN_ORIGIN: string;
  PUBLIC_ORIGINS?: string;
  ADMIN_USER?: string;
  ADMIN_PASSWORD?: string;
  TEST_AUTH_ENABLED?: string;
}

export type Variables = { actor: string };
