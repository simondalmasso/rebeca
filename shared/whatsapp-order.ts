import { formatArs,lineTotalCents } from './money';
export type OrderItem={title:string;size?:string|null;color?:string|null;quantity:number;unitPriceCents:number};
export type OrderInput={code:string;name:string;delivery:string;note?:string;items:OrderItem[]};
const ALPHABET='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function buildOrderCode(date=new Date(),randomBytes:(size:number)=>Uint8Array=(size)=>crypto.getRandomValues(new Uint8Array(size))){
  const y=date.getFullYear(); const m=String(date.getMonth()+1).padStart(2,'0'); const d=String(date.getDate()).padStart(2,'0');
  const suffix=[...randomBytes(5)].map(v=>ALPHABET[v%ALPHABET.length]).join('');
  return `RB-${y}${m}${d}-${suffix}`;
}
export function buildWhatsAppMessage(input:OrderInput){
  const lines=input.items.map((item,index)=>{
    const variant=[item.size,item.color].filter(Boolean).join(' / ')||'Sin variante';
    return `${index+1}. ${item.title} — ${variant} × ${item.quantity} — ${formatArs(lineTotalCents(item.unitPriceCents,item.quantity))}`;
  });
  const total=input.items.reduce((sum,item)=>sum+lineTotalCents(item.unitPriceCents,item.quantity),0);
  return ['Hola Rebeca, quiero hacer este pedido.',`Pedido: ${input.code}`,`Nombre: ${input.name.trim()}`,`Entrega: ${input.delivery}`,'',...lines,'',`Total: ${formatArs(total)}`,...(input.note?.trim()?[`Nota: ${input.note.trim()}`]:[])].join('\n');
}
export function buildWhatsAppUrl(e164:string,message:string){const digits=e164.replace(/^\+/,'');if(!/^\d{8,15}$/.test(digits))throw new Error('invalid_whatsapp_number');return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;}
