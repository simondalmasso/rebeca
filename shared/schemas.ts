import { z } from 'zod';
export const categoryInputSchema=z.object({slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),name:z.string().trim().min(1),description:z.string().trim().nullable().optional(),sortOrder:z.number().int().default(0),active:z.boolean().default(true)});
export const storeSettingsInputSchema=z.object({storeName:z.string().trim().min(1),instagramUrl:z.string().url(),whatsappNumber:z.string().trim().nullable(),deliveryLabel:z.string().trim().min(1),pickupLabel:z.string().trim().min(1),demoMode:z.boolean()});
export const importRequestSchema=z.object({format:z.enum(['csv','json']),sourceName:z.string().trim().min(1),payload:z.union([z.string(),z.array(z.unknown())])});
export function validE164(value:string|null|undefined){return value===null||value===undefined||/^\+?[1-9]\d{7,14}$/.test(value);}
