import { readFile,writeFile } from 'node:fs/promises';

const files=process.argv.slice(2);
if(files.length!==3) throw new Error('Expected exactly three Lighthouse JSON reports');
const reports=await Promise.all(files.map(async file=>JSON.parse(await readFile(file,'utf8'))));
const median=values=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
const score=key=>median(reports.map(report=>(report.categories[key]?.score ?? 0)*100));
const audit=key=>median(reports.map(report=>Number(report.audits[key]?.numericValue ?? Number.POSITIVE_INFINITY)));
const summary={
  performance:score('performance'),
  accessibility:score('accessibility'),
  bestPractices:score('best-practices'),
  seo:score('seo'),
  lcpMs:audit('largest-contentful-paint'),
  cls:audit('cumulative-layout-shift'),
};
await writeFile('lighthouse/summary.json',`${JSON.stringify(summary,null,2)}\n`);
console.log(`LIGHTHOUSE=P${summary.performance.toFixed(0)}/A${summary.accessibility.toFixed(0)}/BP${summary.bestPractices.toFixed(0)}/SEO${summary.seo.toFixed(0)} LCP=${Math.round(summary.lcpMs)}ms CLS=${summary.cls.toFixed(3)}`);
const failures=[];
if(summary.performance<90) failures.push(`performance ${summary.performance.toFixed(0)} < 90`);
if(summary.accessibility<95) failures.push(`accessibility ${summary.accessibility.toFixed(0)} < 95`);
if(summary.bestPractices<95) failures.push(`best-practices ${summary.bestPractices.toFixed(0)} < 95`);
if(summary.seo<90) failures.push(`seo ${summary.seo.toFixed(0)} < 90`);
if(summary.lcpMs>2500) failures.push(`LCP ${Math.round(summary.lcpMs)}ms > 2500ms`);
if(summary.cls>0.1) failures.push(`CLS ${summary.cls.toFixed(3)} > 0.1`);
if(failures.length){console.error(`LIGHTHOUSE_GATE=FAIL ${failures.join('; ')}`);process.exit(1);}
console.log('LIGHTHOUSE_GATE=PASS');
