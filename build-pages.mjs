import {writeFile} from 'node:fs/promises';
import worker from './index.js';
import {motif,motifStyles,motifScript} from './motif.mjs';
const arch='<div class="arch"><div class="logofull" role="img" aria-label="Abu Hamid Academy logo"></div><div class="arabic" lang="ar" dir="rtl">العِلْمُ نُورٌ</div><small>KNOWLEDGE IS LIGHT</small></div>';
const quotes = {
 '/about': ['Knowledge of self is the key to the knowledge of God.', 'The Alchemy of Happiness · Chapter I', 'https://www.ghazali.org/books/alchemy/tah05.htm'],
 '/classes': ['Knowledge without action is madness and action without knowledge is void.', 'Letter to a Disciple', 'https://www.emaanlibrary.com/wp-content/uploads/2019/10/letter-to-a-disciple-english.pdf'],
 '/teacher': ['The most excellent state of the guiding teacher is his joining between knowledge and action.', 'Mukhtasar Ihya ‘Ulum al-Din · Knowledge and Learning', 'https://www.imamghazali.org/blog/etiquettes-teacher-student-mukhtasar'],
 '/contact': ['For perfect happiness mere knowledge is not enough, unaccompanied by love.', 'The Alchemy of Happiness · Chapter VIII', 'https://sacred-texts.com/book/the-alchemy-of-happiness/chapter-viii-the-love-of-god'],
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
if(path==='/') html=html.replace(arch,motif).replace('</body>',motifScript+'</body>');
if(path==='/about') html=html.replace(/<div class="wrap pageintro">([\s\S]*?)<\/div><section/, '<div class="wrap"><section class="hero about-hero"><div>$1</div>'+arch+'</section></div><section');
if(path==='/' || path==='/about') html=html.replace('</head>',motifStyles+'</head>');
const canonical='https://abuhamid.academy'+(path==='/'?'/':path+'.html');
const title=html.match(/<title>(.*?)<\/title>/)[1];
const description=html.match(/<meta name="description" content="([^"]*)"/)[1];
html=html.replace('</head>', `<link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="Abu Hamid Academy"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://abuhamid.academy/social-preview.png"><meta property="og:image:width" content="554"><meta property="og:image:height" content="198"><meta property="og:image:alt" content="Abu Hamid Academy logo on a navy background"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="https://abuhamid.academy/social-preview.png"><meta name="twitter:image:alt" content="Abu Hamid Academy logo on a navy background"></head>`);
if(quotes[path]) {
 const [text,work,url]=quotes[path];
 const quote=`<section class="quote pattern"><div class="mark" aria-hidden="true">“</div><blockquote cite="${url}">${text}</blockquote><cite>Abu Hamid al-Ghazali<br><a href="${url}" style="font-size:10px;letter-spacing:1px">${work}</a></cite></section>`;
 const existing=/<section class="quote pattern">[\s\S]*?<\/section>/;
 html=existing.test(html)?html.replace(existing,quote):html.replace('</main>',quote+'</main>');
}
await writeFile(path==='/'?'index.html':path.slice(1)+'.html',html);}
const logo=await worker.fetch(new Request('https://abuhamid.academy/logo.png'),{});await writeFile('logo.png',Buffer.from(await logo.arrayBuffer()));
await writeFile('CNAME','abuhamid.academy\n');await writeFile('.nojekyll','');await writeFile('robots.txt','User-agent: *\nAllow: /\nSitemap: https://abuhamid.academy/sitemap.xml\n');await writeFile('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(p=>'<url><loc>https://abuhamid.academy'+(p==='/'?'/':p+'.html')+'</loc></url>').join('')+'</urlset>');console.log('Built GitHub Pages website. Enrolment opening soon.');
