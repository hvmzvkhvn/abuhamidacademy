import {writeFile} from 'node:fs/promises';
import worker from './index.js';
const quotes = {
 '/about': ['Cooperate with one another in goodness and righteousness.', '5:2', 'https://quran.com/5/2'],
 '/classes': ['My Lord! Increase me in knowledge.', '20:114', 'https://quran.com/20/114'],
 '/teacher': ['Are those who know equal to those who do not know?', '39:9', 'https://quran.com/39/9'],
 '/contact': ['And made you into peoples and tribes so that you may ˹get to˺ know one another.', '49:13', 'https://quran.com/49/13'],
};
const paths=['/','/about','/classes','/teacher','/contact'];
for(const path of paths){let html=await(await worker.fetch(new Request('https://abuhamid.academy'+path),{})).text();
html=html.replace(/href="\/(about|classes|teacher|contact)(?=["?#])/g,'href="/$1.html');
html=html.replace(/Register your interest/g,'Enrolment information').replace(/register your interest/g,'view enrolment information').replace('Register your interest in a programme or send us an enquiry using the form below.','Enrolment is opening soon. Explore our programmes and check back here for registration details.');
html=html.replace(/<form id="interest">[\s\S]*?<\/form>/,'<div class="card"><span class="badge">ENROLMENT OPENING SOON</span><h3>We look forward to welcoming you.</h3><p>Registration is not open yet. Details of how to enrol, programme start dates, and fees will be announced here.</p><p>No applications or enquiries are being collected through this website at present.</p><a class="textlink" href="/classes.html">Explore our classes ↗</a></div>');
html=html.replace('REGISTRATION OF INTEREST','ENROLMENT INFORMATION').replace('Tell us a little about yourself.','Enrolment opening soon.').replace('Please use the <a href="/contact.html#register"><u>website enquiry form</u></a>.','Please visit our <a href="/contact.html#register"><u>enrolment information</u></a>.');
html=html.replace('Registering your interest does not confirm a place. ','').replace('Your journey begins with a first step.','Your journey begins with a first step.');
html=html.replace(/<script>[\s\S]*?<\/script>/,'<script>document.querySelector(".menu").onclick=()=>{const n=document.querySelector(".navlinks");n.classList.toggle("open");document.querySelector(".menu").setAttribute("aria-expanded",n.classList.contains("open"))};document.querySelector(".whatsapp").onclick=()=>{const n=document.querySelector(".whatsnote");n.hidden=!n.hidden;document.querySelector(".whatsapp").setAttribute("aria-expanded",!n.hidden)};</script>');
html=html.replace('Enrolment information in a programme or send us an enquiry using the form below.','Enrolment is opening soon. Explore our programmes and check back here for registration details.').replaceAll('Enrolment information in our programmes.','Registration details will be announced here.').replaceAll('Enrolment enquiry','Enrolment information');
const canonical='https://abuhamid.academy'+(path==='/'?'/':path+'.html');
const title=html.match(/<title>(.*?)<\/title>/)[1];
const description=html.match(/<meta name="description" content="([^"]*)"/)[1];
html=html.replace('</head>', `<link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="Abu Hamid Academy"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://abuhamid.academy/social-preview.png"><meta property="og:image:width" content="554"><meta property="og:image:height" content="198"><meta property="og:image:alt" content="Abu Hamid Academy logo on a navy background"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="https://abuhamid.academy/social-preview.png"><meta name="twitter:image:alt" content="Abu Hamid Academy logo on a navy background"></head>`);
if(quotes[path]) {
 const [text,verse,url]=quotes[path];
 const quote=`<section class="quote pattern"><div class="mark" aria-hidden="true">“</div><blockquote cite="${url}">${text}</blockquote><cite><a href="${url}">Qur’an ${verse} · excerpt</a><br><span style="font-size:10px;letter-spacing:1px">Translation: Dr Mustafa Khattab, The Clear Quran</span></cite></section>`;
 const existing=/<section class="quote pattern">[\s\S]*?<\/section>/;
 html=existing.test(html)?html.replace(existing,quote):html.replace('</main>',quote+'</main>');
}
await writeFile(path==='/'?'index.html':path.slice(1)+'.html',html);}
const logo=await worker.fetch(new Request('https://abuhamid.academy/logo.png'),{});await writeFile('logo.png',Buffer.from(await logo.arrayBuffer()));
await writeFile('CNAME','abuhamid.academy\n');await writeFile('.nojekyll','');await writeFile('robots.txt','User-agent: *\nAllow: /\nSitemap: https://abuhamid.academy/sitemap.xml\n');await writeFile('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(p=>'<url><loc>https://abuhamid.academy'+(p==='/'?'/':p+'.html')+'</loc></url>').join('')+'</urlset>');console.log('Built GitHub Pages website. Enrolment opening soon.');
