import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://inkfishhomes.com";

const pages = [
  ["home", "/", "Home"],
  ["what", "/what-we-do/", "What we do"],
  ["transition", "/transitional-housing/", "Transitional housing"],
  ["schemes", "/our-schemes/", "Our schemes"],
  ["partners", "/partners/", "For partners"],
  ["story", "/our-story/", "Our story"],
  ["work", "/work-with-us/", "Work with us"],
  ["contact", "/contact/", "Contact"],
  ["privacy", "/privacy/", "Privacy"],
  ["accessibility", "/accessibility/", "Accessibility"],
  ["map", "/site-map/", "Site map"]
];

const photos = [
  ["photo-11.jpg", "A new build house with grey weatherboard cladding"],
  ["photo-12.jpg", "A single storey home with a member of the Inkfish team outside"],
  ["photo-10.jpg", "A detached house with pale cladding and a black front door"],
  ["photo-13.jpg", "A three storey brick house with dormer windows"],
  ["photo-09.jpg", "A row of newly built houses around a shared parking court"],
  ["photo-14.jpg", "A private rear garden with a lawn, patio and fencing"]
];

function nav(current) {
  const links = pages.filter((p) => !["privacy", "accessibility", "map"].includes(p[0])).map(([key, href, label]) => {
    const currentAttr = key === current ? ' aria-current="page"' : "";
    return `<a href="${href}"${currentAttr}>${label}</a>`;
  }).join("");
  return `<a class="lk lk-lg" href="/" aria-label="Inkfish Homes, home"><i class="d" aria-hidden="true"></i><span class="tx" aria-hidden="true"><i class="w w-care"></i><i class="s s-homes"></i></span></a><button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button><nav class="nv" id="site-nav" aria-label="Main">${links}</nav>`;
}

function crumbs(current) {
  const page = pages.find((p) => p[0] === current);
  if (!page || current === "home") return "";
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="${page[1]}" aria-current="page">${page[2]}</a></li></ol></nav>`;
}

function headBlock(dark, current) {
  return `<div class="rail gut${dark ? " on-dark" : ""}">${nav(current)}</div>`;
}

function footer(current) {
  const links = pages.map(([key, href, label]) => {
    const currentAttr = key === current ? ' aria-current="page"' : "";
    return `<li><a href="${href}"${currentAttr}>${label}</a></li>`;
  }).join("");
  return `<footer class="ft"><div class="ft-in gut"><div class="ft-brand"><a class="lk lk-sm" href="/" aria-label="Inkfish Homes, home"><i class="d" aria-hidden="true"></i><span class="tx" aria-hidden="true"><i class="w w-care"></i><i class="s s-homes"></i></span></a></div><div class="ft-legal"><p>Inkfish Homes Ltd. Registered in England and Wales, company number 16126207.<br>Registered office Forder House, 1 Trafalgar Court, Brighton BN1 4FB. Telephone <a href="tel:+441273569396">01273 569 396</a>.<br>Inkfish Homes provides property. Care and support are delivered by our partners, and by Inkfish Care UK Ltd, a separate company.</p></div><nav class="ft-nav" aria-label="Footer"><ul>${links}</ul></nav><div class="ft-links"><a href="/privacy/">Privacy</a><a href="/accessibility/">Accessibility</a><a href="/contact/">Contact us</a></div></div></footer>`;
}

function carousel(label) {
  const slides = photos.map(([file, alt], i) => {
    const on = i === 0 ? " on" : "";
    const hidden = i === 0 ? "" : " hidden";
    const lazy = i === 0 ? "" : ' loading="lazy"';
    return `<figure class="cs-slide${on}"${hidden} aria-hidden="${i === 0 ? "false" : "true"}"><img src="/assets/images/${file}" alt="${alt}" width="1200" height="800"${lazy}><figcaption><span>Delivered by Inkfish Homes</span></figcaption></figure>`;
  }).join("");
  const dots = photos.map((_, i) => `<button type="button" aria-label="Show image ${i + 1} of ${photos.length}"${i === 0 ? ' aria-current="true"' : ""}></button>`).join("");
  return `<div class="cs" role="region" aria-roledescription="carousel" aria-label="${label}"><p class="cs-live vh" aria-live="polite"></p><div class="cs-stage">${slides}</div><div class="cs-ctl"><button type="button" class="cs-prev" aria-label="Previous image"></button><div class="cs-dots">${dots}</div><button type="button" class="cs-next" aria-label="Next image"></button><button type="button" class="cs-pause" aria-pressed="false">Pause</button></div></div>`;
}

function formFields() {
  return `<p class="rf-warn">Tell us what you are trying to solve. You do not need a completed proposal to begin a discussion.</p><fieldset class="rf-set"><legend>About you</legend><div class="cp-grid"><label>Your name<input id="name" name="name" type="text" autocomplete="name" required></label><label>Job title<input id="title" name="title" type="text" autocomplete="organization-title"></label><label class="wide">Organisation<input id="org" name="org" type="text" autocomplete="organization" required></label><label>Email<input id="email" name="email" type="email" autocomplete="email" inputmode="email" required></label><label>Telephone<input id="tel" name="tel" type="tel" autocomplete="tel" inputmode="tel"></label><label class="wide">You are a<select id="role" name="role" required><option value="" selected>Please choose</option><option>Local authority</option><option>Regional Care Cooperative or commissioning partnership</option><option>Housing association or registered provider</option><option>Care or support provider</option><option>Landowner, agent or developer</option><option>Contractor or consultant</option><option>Something else</option></select></label></div></fieldset><fieldset class="rf-set"><legend>What it is about</legend><div class="cp-grid"><label class="wide">This is about<select id="about" name="about" required><option value="" selected>Please choose</option><option>A site or a building</option><option>A scheme we could develop together</option><option>Transitional housing for care leavers</option><option>A service I want to open</option><option>Working with Inkfish Homes</option><option>Something else</option></select></label><label>Location, if you have one<input id="where" name="where" type="text" maxlength="120"></label><label>Timescale<select id="when" name="when"><option value="" selected>Please choose</option><option>As soon as possible</option><option>Within six months</option><option>Within a year</option><option>Longer term</option><option>Not sure yet</option></select></label></div><label class="wide rf-text">Tell us more<textarea id="message" name="message" rows="5" maxlength="1500" required></textarea></label></fieldset><label class="cp-check"><input id="consent" name="consent" type="checkbox" required><span>I am happy for Inkfish Homes to contact me about this enquiry.</span></label><button type="submit" class="b-btn">Send</button><p class="cp-small">Please do not include identifying information about children or other prospective residents in your initial enquiry. Where necessary, we will agree a secure route for sharing further information.</p><p class="cp-small">Inkfish Homes Ltd uses these details only to answer your enquiry. <a href="/privacy/">Read our privacy notice</a> for how long we keep them and your rights. We aim to reply within two working days. If the form cannot be sent from here, your email app opens with the message ready. If it does not open, email <a href="mailto:admin@inkfishhomes.com">admin@inkfishhomes.com</a>.</p>`;
}

function enquiryForm(idPrefix) {
  return `<form class="cp" id="${idPrefix}" action="mailto:admin@inkfishhomes.com" method="post" enctype="text/plain" data-form="homes" novalidate>${formFields()}</form><div class="cp-done" hidden><h2 class="cp-h">Thank you.</h2><p class="done-sent">We have your message and a person will read it. We aim to reply within two working days.</p><p class="done-mail">Your email app should have opened with your message ready to send. Press send and we will reply within two working days. If nothing opened, email <a href="mailto:admin@inkfishhomes.com">admin@inkfishhomes.com</a>.</p></div>`;
}

function dialog() {
  return `<dialog class="ln-dlg cp-dlg" id="eq-dlg" aria-labelledby="eq-title"><button type="button" class="ln-x" data-close aria-label="Close"></button><form class="cp" id="eq-form" action="mailto:admin@inkfishhomes.com" method="post" enctype="text/plain" data-form="homes" novalidate><p class="b-eye">Inkfish Homes</p><h2 class="cp-h" id="eq-title">Start a conversation.</h2>${formFields()}</form><div class="cp-done" hidden><h2 class="cp-h">Thank you.</h2><p class="done-sent">We have your message and a person will read it. We aim to reply within two working days.</p><p class="done-mail">Your email app should have opened with your message ready to send. Press send and we will reply within two working days. If nothing opened, email <a href="mailto:admin@inkfishhomes.com">admin@inkfishhomes.com</a>.</p></div></dialog>`;
}

function jsonLd(page) {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${origin}/#org`,
      name: "Inkfish Homes Ltd",
      url: `${origin}/`,
      email: "admin@inkfishhomes.com",
      telephone: "+441273569396",
      logo: `${origin}/assets/images/logo-inkfish-mark.svg`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Forder House, 1 Trafalgar Court",
        addressLocality: "Brighton",
        postalCode: "BN1 4FB",
        addressCountry: "GB"
      },
      identifier: "16126207"
    },
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: `${origin}/`,
      name: "Inkfish Homes",
      inLanguage: "en-GB",
      publisher: { "@id": `${origin}/#org` }
    },
    {
      "@type": "WebPage",
      "@id": `${origin}${page.path}#webpage`,
      url: `${origin}${page.path}`,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": `${origin}/#website` },
      about: { "@id": `${origin}/#org` },
      inLanguage: "en-GB"
    }
  ];
  if (page.crumb) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
        { "@type": "ListItem", position: 2, name: page.crumb, item: `${origin}${page.path}` }
      ]
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

function documentPage(page) {
  const canonical = `${origin}${page.path}`;
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#00353F">
<meta name="robots" content="index,follow">
<meta name="google-site-verification" content="A4tkW2_D_aHU_9fqfCaSyfAiMgVERLGloLYnITOj9ak">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Inkfish Homes">
<meta property="og:locale" content="en_GB">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${page.title}">
<meta name="twitter:description" content="${page.description}">
<link rel="icon" href="/assets/images/logo-inkfish-mark.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/css/style.css">
<script type="application/ld+json">${jsonLd(page)}</script>
</head>
<body>
<a class="skip" href="#content">Skip to content</a>
<div class="site">
<main id="main">
${page.body}
</main>
${footer(page.key)}
</div>
${page.dialog ? dialog() : ""}
<script src="/assets/js/main.js"></script>
</body>
</html>
`;
}

function inner(current, innerHtml, doc) {
  return `<header class="b-head${doc ? " doc" : ""}"><span class="b-ghost ghost-head" aria-hidden="true"></span>${headBlock(true, current)}<div class="gut"><div class="hwrap solo"><div>${crumbs(current)}${innerHtml}</div></div></div></header>`;
}

const home = {
  key: "home",
  path: "/",
  title: "Inkfish Homes | Specialist housing shaped around people",
  description: "Inkfish Homes develops specialist housing with care providers, housing associations and commissioning partners.",
  dialog: true,
  body: `<header class="hhero"><div class="himg" aria-hidden="true"></div><div class="hveil" aria-hidden="true"></div>${headBlock(true, "home")}<div class="hbody gut"><p class="heyeb"><s aria-hidden="true"></s>Inkfish Homes</p><h1 id="content" tabindex="-1">Specialist housing shaped around <u>people and local need.</u></h1><p class="hstate">Inkfish Homes develops specialist housing with care providers, housing associations and commissioning partners. <strong>We bring together property expertise and investment to create homes that support safety, stability and progression.</strong></p><div class="hctas"><a class="a" href="/contact/" data-open="eq-dlg">Discuss your housing requirements</a><a class="b" href="/our-schemes/">Explore our work</a></div></div></header>
<section class="b-sec st"><span class="b-ghost" aria-hidden="true"></span><div class="gut b-2 top"><div><p class="b-eye">Supporting local sufficiency</p><h2 class="b-h">Early discussions about <em>gaps in provision.</em></h2></div><div class="b-body"><p>From supported housing and children’s homes to transitional accommodation for care leavers, our focus is on suitable provision in the right locations, designed around the people who will live there.</p><p><b>We welcome early discussions with local authorities, Regional Care Cooperatives and commissioning partnerships about gaps in provision.</b> Understanding demand, individual needs and the intended support model helps us shape the property brief before a scheme is developed.</p></div></div></section>
<section class="b-sec wh" aria-labelledby="everyday-heading"><span class="b-ghost" aria-hidden="true"></span><div class="gut"><div class="b-cs"><div class="cs-copy"><p class="b-eye">Homes designed for everyday life</p><h2 class="b-h" id="everyday-heading">Comfort, privacy and <em>space to build relationships.</em></h2><div class="b-body"><p>A good home should offer comfort, privacy and space to build relationships. It should also enable staff to provide support effectively, with appropriate facilities and a practical layout.</p><p>Our approach considers accessibility, ongoing maintenance and adaptation as needs change, supporting the long term suitability of each property.</p></div><a class="b-btn" href="/our-schemes/">Explore our work</a></div>${carousel("Homes delivered by Inkfish")}</div><p class="b-note">To protect residents’ privacy, occupied homes are shown without identifying addresses.</p></div></section>
<section class="b-sec de"><div class="gut b-2"><div><p class="b-eye">Shared purpose across Inkfish</p><h2 class="b-h">Progression, <em>not containment.</em></h2><div class="b-body"><p>Inkfish Homes and Inkfish Care share a commitment to progression, not containment. <b>Homes provides the property expertise; Care develops and delivers residential care services.</b></p><p>Together, our ambition is to create environments where people feel safe, build trust and move forward.</p></div><a class="b-btn" href="https://www.inkfishcare.com" rel="noopener noreferrer">Visit Inkfish Care</a></div><div><div class="b-rimg th2" role="img" aria-label="A detached house with pale cladding and a black front door"></div><p class="b-cap">Delivered by Inkfish Homes</p></div></div></section>
<section class="b-sec wh"><div class="gut b-cta"><div><p class="b-eye">Start here</p><h2 class="b-h">Discuss your housing requirements.</h2><p class="b-lead">You do not need a completed proposal to begin a discussion.</p></div><a class="b-btn" href="/contact/" data-open="eq-dlg">Start a conversation</a></div></section>`
};

const what = {
  key: "what",
  path: "/what-we-do/",
  crumb: "What we do",
  title: "What we do | Inkfish Homes",
  description: "Inkfish Homes identifies, appraises, designs and develops properties for specialist supported housing, children’s homes, transitional housing and development partnerships.",
  dialog: true,
  body: `${inner("what", `<p class="b-eye">What we do</p><h1 id="content" tabindex="-1">Property expertise for <em>specialist provision.</em></h1><p>We identify, appraise, design and develop properties around an agreed service brief. Working with partners from the outset helps align location, layout and specification with the needs of residents and the requirements of the service.</p>`)}
<section class="b-sec st"><div class="gut"><p class="b-eye">Our work</p><h2 class="b-h">Four areas <em>of provision.</em></h2><div class="b-hire two"><div><span class="b-badge" aria-hidden="true"><b>1</b></span><div><h3>Specialist supported housing</h3><p>Accommodation designed around residents’ needs, with appropriate space for independence, shared living and staff support.</p></div></div><div><span class="b-badge" aria-hidden="true"><b>2</b></span><div><h3>Children’s homes</h3><p>Properties developed for Inkfish Care and other care providers, with layouts that support a comfortable home environment and effective care delivery.</p></div></div><div><span class="b-badge" aria-hidden="true"><b>3</b></span><div><h3>Transitional housing for care leavers</h3><p>Our ambition is to develop accommodation that gives young people a stable foundation as they move towards independence, with housing and support arrangements planned alongside leaving care teams and delivery partners.</p><a class="b-btn" href="/transitional-housing/">Transitional housing</a></div></div><div><span class="b-badge" aria-hidden="true"><b>4</b></span><div><h3>Development partnerships</h3><p>Site identification, appraisal and development through to handover, with responsibilities, specifications and delivery expectations agreed with partners.</p></div></div></div></div></section>
<section class="b-sec or"><div class="gut b-cta"><div><p class="b-eye">Next</p><h2 class="b-h">Have a housing requirement in mind?</h2></div><a class="b-btn" href="/contact/" data-open="eq-dlg">Discuss your housing requirements</a></div></section>`
};

const transition = {
  key: "transition",
  path: "/transitional-housing/",
  crumb: "Transitional housing",
  title: "Transitional housing for care leavers | Inkfish Homes",
  description: "Inkfish Homes aims to plan accommodation and support together, so young people leaving care have a stable home and a route towards independence.",
  dialog: true,
  body: `${inner("transition", `<p class="b-eye">Transitional housing</p><h1 id="content" tabindex="-1">A stable home for <em>the transition from care.</em></h1><p>Leaving care should come with suitable accommodation, trusted support and opportunities to build an independent life. Housing needs to be planned alongside practical skills, education, employment and the relationships that help a young person sustain progress.</p>`)}
<section class="b-sec wh"><div class="gut"><p class="b-eye">The picture in England</p><h2 class="b-h">Earlier housing planning <em>also matters.</em></h2><div class="th-tiles"><div class="th-tile"><b>36%</b><h3>In semi independent accommodation at 18</h3><p>Care leavers aged 18 in England living in semi independent transitional accommodation in 2025.</p></div><div class="th-tile"><b>40%</b><h3>Outside education, employment or training</h3><p>Care leavers aged 19 to 21 in 2025, compared with an estimated 15% of all young people of the same age.</p></div><div class="th-tile"><b>67.4%</b><h3>Already homeless when assessed</h3><p>Households recorded with care leaver support needs entering England’s homelessness system in 2023 to 2024.</p></div></div><p class="b-note">Sources: Department for Education, <a href="https://explore-education-statistics.service.gov.uk/find-statistics/children-looked-after-in-england-including-adoptions/2025" rel="noopener noreferrer">Children looked after in England including adoptions, reporting year 2025</a>. Ministry of Housing, Communities and Local Government, <a href="https://www.gov.uk/government/statistics/statutory-homelessness-in-england-financial-year-2023-24" rel="noopener noreferrer">Statutory homelessness in England, financial year 2023 to 2024</a>. The homelessness figure covers households approaching homelessness services, not all care leavers.</p></div></section>
<section class="b-sec te"><div class="gut b-2 top"><div><p class="b-eye">Our proposed approach</p><h2 class="b-h">Accommodation and support, <em>planned together.</em></h2></div><div class="b-body"><p>Inkfish Homes aims to work with housing, leaving care and commissioning teams to develop transitional provision around identified needs. <b>Our proposed approach includes accommodation close enough to enable coordinated support, while preserving personal space, privacy and independence.</b></p><p>Each scheme would have clear arrangements for accommodation, support, safeguarding and planned moves into longer term housing.</p></div></div></section>
<section class="b-sec or"><div class="gut b-cta"><div><p class="b-eye">Next</p><h2 class="b-h">Discuss a gap in provision.</h2></div><a class="b-btn" href="/contact/" data-open="eq-dlg" data-about="Transitional housing for care leavers">Start a conversation</a></div></section>`
};

const schemes = {
  key: "schemes",
  path: "/our-schemes/",
  crumb: "Our schemes",
  title: "Our schemes | Inkfish Homes",
  description: "Development experience since 2021 in supported housing and specialist children’s homes, with care providers, housing associations and local authorities.",
  dialog: true,
  body: `${inner("schemes", `<p class="b-eye">Our schemes</p><h1 id="content" tabindex="-1">Experience in specialist <em>housing development.</em></h1><p>Our development experience began in 2021 with supported housing projects involving care providers, housing associations and local authorities, followed by specialist children’s homes.</p>`)}
<section class="b-sec wh"><div class="gut"><p class="b-eye">Delivered by Inkfish Homes</p><h2 class="b-h">The property experience <em>behind Inkfish Homes.</em></h2><p class="b-lead">The schemes shown here demonstrate the property experience behind Inkfish Homes. We welcome discussions about relevant projects, their delivery requirements and the lessons that can inform future provision.</p><div>${carousel("Homes delivered by Inkfish")}</div><p class="b-note">To protect residents’ privacy, occupied homes are shown without identifying addresses.</p></div></section>
<section class="b-sec st"><div class="gut b-cta"><div><p class="b-eye">Next</p><h2 class="b-h">Discuss a relevant project.</h2></div><a class="b-btn" href="/contact/" data-open="eq-dlg">Start a conversation</a></div></section>`
};

const partners = {
  key: "partners",
  path: "/partners/",
  crumb: "For partners",
  title: "For commissioners and partners | Inkfish Homes",
  description: "Inkfish Homes welcomes early discussions with local authorities, Regional Care Cooperatives, housing associations and care providers about unmet housing need.",
  dialog: true,
  body: `${inner("partners", `<p class="b-eye">For commissioners and partners</p><h1 id="content" tabindex="-1">Develop provision around <em>your priorities.</em></h1><p>We welcome discussions with local authorities, Regional Care Cooperatives, regional commissioning partnerships, housing associations and care providers about unmet housing needs.</p>`)}
<section class="b-sec wh"><div class="gut b-2 top"><div><p class="b-eye">An early conversation</p><h2 class="b-h">Establishing the brief <em>before a scheme.</em></h2><p class="b-lead">You do not need a completed proposal to begin a discussion.</p><a class="b-btn" href="/contact/" data-open="eq-dlg">Discuss a gap in provision</a></div><div class="b-body"><p>An early conversation helps establish the intended residents, location, support requirements, delivery timescale and funding approach. It also clarifies who will provide care or support, manage the accommodation and hold any required registration.</p><p><b>Our aim is to develop proposals that contribute to local sufficiency, demonstrate value for money and remain suitable over time.</b></p></div></div></section>
<section class="b-sec or"><div class="gut mid"><p class="b-eye">Start here</p><h2 class="b-h">Discuss a gap <em>in provision.</em></h2><div><a class="b-btn cp-big" href="/contact/" data-open="eq-dlg">Start a conversation</a></div></div></section>`
};

const story = {
  key: "story",
  path: "/our-story/",
  crumb: "Our story",
  title: "Our story | Inkfish Homes",
  description: "Inkfish grew from specialist housing development and a belief that the environment people live in can make a meaningful difference to their lives.",
  dialog: true,
  body: `<header class="b-head"><span class="b-ghost ghost-head" aria-hidden="true"></span>${headBlock(true, "story")}<div class="gut"><div class="hwrap"><div>${crumbs("story")}<p class="b-eye">Our story</p><h1 id="content" tabindex="-1">One ethos across <em>housing and care.</em></h1><p>Inkfish grew from specialist housing development and a belief that the environment people live in can make a meaningful difference to their lives.</p></div><div><div class="b-rimg story" role="img" aria-label="Louis Stedman-Bryce being interviewed in the Sky News studio"></div></div></div></div></header>
<section class="b-sec wh"><div class="gut b-2 top"><div><p class="b-eye">Our purpose</p><h2 class="b-h">Safety, trust and <em>the opportunity to progress.</em></h2></div><div class="b-body"><p>That purpose is shaped by founder Louis Stedman-Bryce’s own experience of care. <b>Safety, trust and the opportunity to progress underpin the Group’s ambitions</b>, from developing suitable housing to building care services and supporting its teams.</p><p>Inkfish Homes brings property expertise to that shared purpose, working with partners to create homes around genuine need.</p></div></div></section>
<section class="b-sec st"><div class="gut b-cta"><div><p class="b-eye">Inkfish Care</p><h2 class="b-h">The care side of Inkfish.</h2></div><a class="b-btn" href="https://www.inkfishcare.com" rel="noopener noreferrer">Visit Inkfish Care</a></div></section>`
};

const work = {
  key: "work",
  path: "/work-with-us/",
  crumb: "Work with us",
  title: "Work with us | Inkfish Homes",
  description: "Inkfish Homes welcomes enquiries from care and support providers, housing partners, landowners, agents, architects and development professionals.",
  dialog: true,
  body: `${inner("work", `<p class="b-eye">Work with us</p><h1 id="content" tabindex="-1">Build suitable <em>provision together.</em></h1><p>We welcome enquiries from care and support providers, housing partners, landowners, agents, architects and development professionals.</p>`)}
<section class="b-sec te"><div class="gut b-2 top"><div><p class="b-eye">What we look for</p><h2 class="b-h">Sites and buildings for <em>specialist provision.</em></h2></div><div class="b-body"><p>We are interested in sites and buildings that can support specialist provision, with suitable space, access to local services and the potential to meet residents’ needs over time.</p></div></div></section>
<section class="b-sec or"><div class="gut b-cta"><div><p class="b-eye">Get in touch</p><h2 class="b-h">Discuss a property or partnership.</h2></div><a class="b-btn" href="/contact/" data-open="eq-dlg" data-about="A site or a building">Start a conversation</a></div></section>`
};

const contact = {
  key: "contact",
  path: "/contact/",
  crumb: "Contact",
  title: "Contact Inkfish Homes",
  description: "Contact Inkfish Homes about a commissioning priority, a proposed service, a development opportunity or a suitable property.",
  dialog: false,
  body: `${inner("contact", `<p class="b-eye">Contact</p><h1 id="content" tabindex="-1">Tell us about your <em>housing requirements.</em></h1><p>Contact us about a commissioning priority, proposed service, development opportunity or suitable property. You do not need a completed proposal to begin a discussion.</p>`)}
<section class="b-sec st"><div class="gut"><p class="b-eye">Three ways in</p><h2 class="b-h">Where would you <em>like to start?</em></h2><div class="b-hire three"><div><span class="b-badge" aria-hidden="true"><b>1</b></span><div><h3>Discuss housing requirements</h3><p>A commissioning priority or a proposed service</p><a class="b-btn" href="#enquiry">Start a conversation</a></div></div><div><span class="b-badge" aria-hidden="true"><b>2</b></span><div><h3>Propose a site or building</h3><p>Landowners, agents and developers</p><a class="b-btn" href="#enquiry">Start a conversation</a></div></div><div><span class="b-badge" aria-hidden="true"><b>3</b></span><div><h3>Explore a delivery partnership</h3><p>Care providers, housing associations and development professionals</p><a class="b-btn" href="#enquiry">Start a conversation</a></div></div></div><p class="b-note">Please do not include identifying information about children or other prospective residents in your initial enquiry. Where necessary, we will agree a secure route for sharing further information.</p></div></section>
<section class="b-sec wh" id="enquiry"><div class="gut enquiry-wrap"><p class="b-eye">Enquiry</p><h2 class="b-h">Start a conversation.</h2>${enquiryForm("eq-form")}</div></section>
<section class="b-sec te"><div class="gut b-2 top"><div><p class="b-eye">Direct</p><h2 class="b-h">Or just <em>email us.</em></h2><p class="b-lead"><a href="mailto:admin@inkfishhomes.com">admin@inkfishhomes.com</a><br><a href="tel:+441273569396">01273 569 396</a></p></div><div class="b-body"><p><b>Inkfish Homes Ltd</b>, registered in England and Wales, company number 16126207, at Forder House, 1 Trafalgar Court, Brighton BN1 4FB.</p><p>We aim to reply to every message within two working days. If your message is about a child’s placement or about care, it belongs with <a href="https://www.inkfishcare.com" rel="noopener noreferrer">Inkfish Care</a>, which is a separate company.</p></div></div></section>`
};

const privacy = {
  key: "privacy",
  path: "/privacy/",
  crumb: "Privacy",
  title: "Privacy notice | Inkfish Homes",
  description: "How Inkfish Homes Ltd uses personal information sent through this website and by email.",
  dialog: false,
  body: `${inner("privacy", `<p class="b-eye">Inkfish Homes Ltd</p><h1 id="content" tabindex="-1">Privacy notice.</h1><p class="pv-date">Draft, September 2026</p>`, true)}
<section class="b-sec wh doc-body"><div class="gut b-prose"><h2>Who we are</h2><p>Inkfish Homes Ltd is the data controller for the personal information described here. We are registered in England and Wales, company number 16126207. Questions about this notice or your information: <a href="mailto:admin@inkfishhomes.com">admin@inkfishhomes.com</a>.</p><p>Inkfish Care UK Ltd is a separate company with its own privacy notice, which applies to anything you send to it.</p><h2>What this notice covers</h2><p>This website, the enquiry form on it, and emails you send us. It does not cover tenancies or care, which are held by the partners who run our buildings.</p><h2>What we collect and why</h2><p><b>Enquiries.</b> Your name, job title, organisation, email, telephone number and whatever you choose to tell us, so that we can answer you and, where it goes further, work on a scheme with you. Our lawful basis is legitimate interests: responding to professionals who contact us about property.</p><p>We ask you not to send us personal information about people you support through this website. Where a scheme needs that, we agree a secure route first.</p><h2>Who we share it with</h2><p>We never sell your information. We share it only with the companies that run our systems for us, such as our email and records providers, under contracts that require them to keep it secure and use it only on our instructions, and with professional advisers or partners where that is needed to progress a scheme you have asked us about.</p><h2>How long we keep it</h2><ul><li>Enquiries that do not go further: two years from our last contact with you.</li><li>Enquiries that become a scheme: for as long as we hold an interest in that scheme, and then for six years.</li><li>General emails: two years, unless they form part of a record we must keep for longer.</li></ul><h2>Your rights</h2><p>You can ask for a copy of your information, and ask us to correct it, delete it, restrict how we use it or stop using it. You can also object to how we use it. Email <a href="mailto:admin@inkfishhomes.com">admin@inkfishhomes.com</a>. We will reply within one month.</p><p>If you are unhappy with how we have handled your information, you can complain to the Information Commissioner’s Office: <a href="https://ico.org.uk" rel="noopener noreferrer">ico.org.uk</a>, telephone <a href="tel:+443031231113">0303 123 1113</a>.</p><h2>Cookies</h2><p>This website does not use cookies. If that changes, we will update this notice and ask for your agreement first.</p></div></section>`
};

const accessibility = {
  key: "accessibility",
  path: "/accessibility/",
  crumb: "Accessibility",
  title: "Accessibility | Inkfish Homes",
  description: "How the Inkfish Homes website is built for WCAG 2.2 level AA, and how to ask for information in another format.",
  dialog: false,
  body: `${inner("accessibility", `<p class="b-eye">Accessibility</p><h1 id="content" tabindex="-1">Open to everyone.</h1><p>We want everyone to be able to use this website, including people who use screen readers, keyboard navigation, magnification or voice control.</p>`, true)}
<section class="b-sec wh doc-body"><div class="gut b-prose"><p>We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2, level AA. This site is still being tested. If anything is hard to use, or you need information in another format, email <a href="mailto:admin@inkfishhomes.com">admin@inkfishhomes.com</a> and we will help.</p><h2>What you can expect</h2><ul><li>Pages have one main heading, a skip link, and can be used with a keyboard alone.</li><li>Text can be enlarged up to 200 per cent without a separate control, using your browser.</li><li>Colour is not the only way information is shown, and focus is visible.</li><li>Images that carry meaning have text descriptions. Decorative graphics are hidden from assistive technology.</li><li>The enquiry form explains errors in text and does not depend on colour alone.</li><li>Moving image galleries can be paused, and they stay still if you have asked your device to reduce motion.</li><li>We do not use cookies or third-party trackers.</li></ul><p>Last reviewed September 2026.</p></div></section>`
};

const map = {
  key: "map",
  path: "/site-map/",
  crumb: "Site map",
  title: "Site map | Inkfish Homes",
  description: "Every page on the Inkfish Homes website.",
  dialog: false,
  body: `${inner("map", `<p class="b-eye">Site map</p><h1 id="content" tabindex="-1">Every page.</h1><p>Use this list if you want to go straight to a page.</p>`)}
<section class="b-sec wh"><div class="gut"><ul class="site-map-list">${pages.map(([, href, label]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul></div></section>`
};

const notFound = {
  key: "home",
  path: "/404.html",
  title: "Page not found | Inkfish Homes",
  description: "That page is not on the Inkfish Homes website. Use the menu or the site map to continue.",
  dialog: false,
  body: `${inner("home", `<p class="b-eye">404</p><h1 id="content" tabindex="-1">That page is not here.</h1><p>The address may have changed. Use the menu, or open the <a href="/site-map/">site map</a>.</p><p><a class="b-btn" href="/">Back to the home page</a></p>`)}`
};

const all = [home, what, transition, schemes, partners, story, work, contact, privacy, accessibility, map];

for (const page of all) {
  const file = page.path === "/" ? join(root, "index.html") : join(root, page.path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, documentPage(page), "utf8");
}

writeFileSync(join(root, "404.html"), documentPage(notFound).replace(
  '<meta name="robots" content="index,follow">',
  '<meta name="robots" content="noindex">'
), "utf8");

const urls = all.map((p) => `  <url><loc>${origin}${p.path}</loc><lastmod>2026-09-30</lastmod></url>`).join("\n");
writeFileSync(join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, "utf8");
writeFileSync(join(root, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /inkfish-homes-single-file.html\n\nSitemap: ${origin}/sitemap.xml\n`, "utf8");

console.log("Wrote", all.length + 1, "pages");
