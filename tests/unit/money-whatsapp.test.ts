import { describe,expect,it } from 'vitest';
import { formatArs,lineTotalCents } from '../../shared/money';
import { WHATSAPP_URL } from '../../shared/whatsapp-order';

describe('money',()=>{
  it('uses integer centavos',()=>{
    expect(formatArs(1234567)).toBe('$12.345,67');
    expect(formatArs(200000)).toBe('$2.000');
    expect(lineTotalCents(199900,3)).toBe(599700);
  });
});

describe('WhatsApp handoff',()=>{
  it('uses the configured wa.link destination',()=>{
    expect(WHATSAPP_URL).toBe('https://wa.link/6j7b0q');
  });
});
