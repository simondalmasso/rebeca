import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../worker/app';
import { MEDIA_SENTINEL_KEY } from '../../worker/store-state';
import { TestKv } from './kv-shim';

let store: TestKv;
let media: TestKv;
const assets = { fetch: async () => new Response('asset') } as unknown as Fetcher;
const env = (mode = 'test') => ({
  STORE_KV: store.asNamespace(),
  MEDIA_KV: media.asNamespace(),
  ASSETS: assets,
  ENVIRONMENT: mode,
  BUILD_SHA: 'test-sha',
  ADMIN_ORIGIN: 'http://localhost:8787',
  PUBLIC_ORIGINS: 'http://localhost:8787',
  ADMIN_USER: 'rebeca-admin',
  ADMIN_PASSWORD: 'test-only-password',
  TEST_AUTH_ENABLED: '1',
});

const basic = (password = 'test-only-password') =>
  `Basic ${btoa(`rebeca-admin:${password}`)}`;

beforeEach(() => {
  store = new TestKv();
  media = new TestKv();
});

describe('admin security', () => {
  it('rejects missing identity with a browser Basic challenge', async () => {
    const response = await createApp().request('/api/admin/products', {}, env('release'));
    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toContain('REBECA Admin');
  });

  it('accepts release Basic auth and rejects a wrong password', async () => {
    const ok = await createApp().request('/api/admin/products', { headers: { Authorization: basic() } }, env('release'));
    expect(ok.status).toBe(200);
    const bad = await createApp().request('/api/admin/products', { headers: { Authorization: basic('wrong') } }, env('release'));
    expect(bad.status).toBe(401);
  });

  it('protects the admin SPA route in release', async () => {
    const denied = await createApp().request('/admin', {}, env('release'));
    expect(denied.status).toBe(401);
    const allowed = await createApp().request('/admin', { headers: { Authorization: basic() } }, env('release'));
    expect(allowed.status).toBe(200);
  });

  it('rejects mutation with bad origin', async () => {
    const response = await createApp().request(
      '/api/admin/products',
      {
        method: 'POST',
        headers: { 'x-test-admin': '1', 'content-type': 'application/json', Origin: 'https://evil.test' },
        body: '{}',
      },
      env(),
    );
    expect(response.status).toBe(403);
  });

  it('test header cannot activate in release', async () => {
    const response = await createApp().request('/api/admin/products', { headers: { 'x-test-admin': '1' } }, env('release'));
    expect(response.status).toBe(401);
  });

  it('health exposes exact build sha and KV status in test mode', async () => {
    const response = await createApp().request('/api/health', {}, env());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ sha: 'test-sha', storage: 'kv', store: 'ok', media: 'ok' });
  });

  it('release health fails safely until canonical state and media sentinel are seeded', async () => {
    const response = await createApp().request('/api/health', {}, env('release'));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ ok: false, store: 'error', media: 'error' });
  });

  it('release health becomes healthy only after both KV sentinels exist', async () => {
    const testEnv = env();
    await createApp().request('/api/admin/settings', {
      method: 'PUT',
      headers: { 'x-test-admin': '1', 'content-type': 'application/json', Origin: 'http://localhost:8787' },
      body: JSON.stringify({
        storeName: 'REBECA',
        instagramUrl: 'https://www.instagram.com/rebeca_santafee/',
        whatsappNumber: null,
        deliveryLabel: 'Coordinar envío',
        pickupLabel: 'Retiro',
        demoMode: true,
      }),
    }, testEnv);
    await media.put(MEDIA_SENTINEL_KEY, 'ok');
    const releaseEnv = { ...env('release'), TEST_AUTH_ENABLED: undefined };
    const response = await createApp().request('/api/health', {}, releaseEnv);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, store: 'ok', media: 'ok' });
  });
});
