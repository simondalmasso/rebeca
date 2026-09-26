import { readFileSync } from 'node:fs';
import type { APIRequestContext } from '@playwright/test';
import type { CanonicalProductInput } from '../../shared/catalog-contract';

const demo = JSON.parse(
  readFileSync(new URL('../../data/demo-catalog.json', import.meta.url), 'utf8'),
) as CanonicalProductInput[];

const headers = {
  'x-test-admin': '1',
  Origin: 'http://127.0.0.1:8787',
  'content-type': 'application/json',
};

export async function seedDemo(request: APIRequestContext) {
  for (const product of demo) {
    const r = await request.post('/api/admin/products', { headers, data: product });
    if (!r.ok()) throw new Error(`seed ${product.slug}: ${r.status()} ${await r.text()}`);
  }
  const settings = await request.put('/api/admin/settings', {
    headers,
    data: {
      storeName: 'REBECA', instagramUrl: 'https://www.instagram.com/rebeca_santafee/',
      whatsappNumber: '+5493420000000', deliveryLabel: 'Coordinar envío', pickupLabel: 'Retiro', demoMode: true,
    },
  });
  if (!settings.ok()) throw new Error(`settings: ${settings.status()} ${await settings.text()}`);
}

export const adminHeaders = headers;
