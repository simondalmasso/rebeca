export function assertCents(value:number){if(!Number.isInteger(value)||value<0)throw new Error('invalid_money_cents');return value;}
export function lineTotalCents(unitPriceCents:number,quantity:number){assertCents(unitPriceCents);if(!Number.isInteger(quantity)||quantity<0)throw new Error('invalid_quantity');return unitPriceCents*quantity;}
export function formatArs(cents:number){
  assertCents(cents);
  const pesos=Math.floor(cents/100); const remainder=cents%100;
  const grouped=String(pesos).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  return remainder?`$${grouped},${String(remainder).padStart(2,'0')}`:`$${grouped}`;
}
