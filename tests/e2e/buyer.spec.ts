import { expect,test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { seedDemo } from './helpers';

test.beforeEach(async({request})=>{await seedDemo(request);});

test('buyer flow persists cart and hands off to WhatsApp',async({page})=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.getByRole('link',{name:/Ver tienda/i}).first().click();
  await expect(page).toHaveURL(/\/tienda/);
  await page.getByRole('link',{name:/Ver Top Alba/i}).click();
  await page.getByRole('button',{name:'M',exact:true}).click();
  await page.getByRole('button',{name:'Negro',exact:true}).click();
  await page.getByRole('button',{name:/Agregar al carrito/i}).click();
  await page.getByRole('link',{name:/Ver carrito/i}).click();
  await expect(page.getByText('Top Alba')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Top Alba')).toBeVisible();
  await page.getByRole('link',{name:/Continuar pedido/i}).click();
  await expect(page.getByRole('heading',{name:'Finalizar pedido'})).toBeVisible();
  await expect(page.getByTestId('whatsapp-link')).toHaveAttribute('href','https://wa.link/6j7b0q');
});

test('critical public routes have no serious/critical axe violations',async({page})=>{
  for(const route of['/','/tienda','/producto/top-alba','/carrito']){
    await page.goto(route);
    const results=await new AxeBuilder({page}).analyze();
    expect(results.violations.filter(v=>['critical','serious'].includes(v.impact??'')),route).toEqual([]);
  }
});

test('320px viewport has no horizontal overflow and filters reset',async({page})=>{
  await page.setViewportSize({width:320,height:720});
  const catalogResponse=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/api/catalog');
  await page.goto('/tienda');
  expect((await catalogResponse).ok()).toBe(true);
  await expect(page.getByRole('heading',{name:'Productos'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
  const filters=page.getByRole('button',{name:/Filtros/i});
  await expect(filters).toBeVisible();
  await filters.click();
  await page.getByLabel('Talle').last().selectOption('S');
  await page.getByRole('button',{name:'Limpiar',exact:true}).click();
  await expect(page.getByLabel('Talle').last()).toHaveValue('');
});
