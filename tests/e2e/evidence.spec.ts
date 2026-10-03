import { expect,test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { seedDemo } from './helpers';

const viewports=[
  {width:320,height:720},
  {width:360,height:800},
  {width:390,height:844},
  {width:768,height:1024},
  {width:1440,height:900},
];

test.beforeEach(async({request})=>{await seedDemo(request);});

test('captures ORDER-001 responsive release evidence',async({page},testInfo)=>{
  const evidenceDir=testInfo.outputPath('evidence');
  mkdirSync(evidenceDir,{recursive:true});
  const capture=async(name:string,fullPage=true)=>page.screenshot({path:join(evidenceDir,name),fullPage});

  for(const viewport of viewports){
    const label=`${viewport.width}x${viewport.height}`;
    await page.setViewportSize(viewport);

    await page.goto('/');
    await page.evaluate(()=>localStorage.clear());
    await page.reload();
    await expect(page.getByRole('heading',{level:1})).toBeVisible();
    await capture(`${label}-home-first.png`,false);
    await capture(`${label}-home-full.png`);

    await page.goto('/tienda');
    await expect(page.getByRole('heading',{name:'Productos'})).toBeVisible();
    await capture(`${label}-catalog.png`);

    await page.goto('/producto/top-alba');
    await expect(page.getByRole('heading',{name:'Top Alba'})).toBeVisible();
    await page.getByRole('button',{name:'M',exact:true}).click();
    await page.getByRole('button',{name:'Negro',exact:true}).click();
    await capture(`${label}-pdp-selected.png`);
    await page.getByRole('button',{name:/Agregar al carrito/i}).click();

    await page.goto('/carrito');
    await expect(page.getByText('Top Alba')).toBeVisible();
    await capture(`${label}-cart.png`);

    await page.goto('/checkout');
    await expect(page.getByRole('heading',{name:'Finalizar pedido'})).toBeVisible();
    await capture(`${label}-checkout.png`);

    await page.goto('/admin/productos/nuevo');
    await expect(page.getByRole('heading',{name:'Nuevo producto'})).toBeVisible();
    await capture(`${label}-admin-editor.png`);
  }
});
