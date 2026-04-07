/* ============================================
   ФИШИНГ IQ ТЕСТ — SCRIPT.JS
   Шинэ функцүүд:
   - Нэр оруулах → Насны бүлэг сонгох (2 алхам)
   - 6-18 / 18-35 / 35-60+ насны бүлгийн асуултын сет
   - 20 секундын таймер (дугуй)
   - Leaderboard + confetti animation
   - Дэлгэрэнгүй үр дүн
   ============================================ */
/* ==================================================
   BACKGROUND CANVAS ANIMATION
   ================================================== */
(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], lines = [];
  const NODE_COUNT = 40;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.5 + .5,
      opacity: Math.random() * .5 + .2,
      color: Math.random() > .6 ? '#06d6f5' : '#1a6cf6'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          const alpha = (1 - dist/160) * .18;
          ctx.strokeStyle = `rgba(26,108,246,${alpha})`;
          ctx.lineWidth = .7;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.color.replace(')', `,${n.opacity})`).replace('rgb(', 'rgba(').replace('#06d6f5', 'rgba(6,214,245,').replace('#1a6cf6', 'rgba(26,108,246,');
      ctx.fill();

      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  // Fix color rendering
  nodes.forEach(n => {
    n._draw = function() {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      const c = n.color === '#06d6f5' ? `rgba(6,214,245,${n.opacity})` : `rgba(26,108,246,${n.opacity})`;
      ctx.fillStyle = c;
      ctx.fill();
    };
  });

  function draw2() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(26,108,246,${(1 - dist/160) * .15})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      n._draw();
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
    requestAnimationFrame(draw2);
  }
  draw2();
})();

/* ==================================================
   FLOATING EMAIL CARDS IN HERO
   ================================================== */
function spawnHeroEmails() {
  const container = document.getElementById('hero-emails');
  if (!container) return;
  const samples = [
    { from: 'PayPal Security', addr: 'security@paypa1-verify.com', sub: '⚠️ Акаунт хязгаарлагдсан!', type: 'phish' },
    { from: 'GitHub', addr: 'noreply@github.com', sub: 'Pull request нэгтгэгдлээ', type: 'legit' },
    { from: 'Apple ID Support', addr: 'appleid@apple-id-secure.net', sub: 'Акаунт аюулд орсон байна', type: 'phish' },
    { from: 'Google', addr: 'no-reply@accounts.google.com', sub: 'Шинэ нэвтрэлт илэрлээ', type: 'legit' },
    { from: 'Bank of America', addr: 'alert@bofa-secure-notification.com', sub: 'Сэжигтэй гүйлгээ $847', type: 'phish' },
    { from: 'Slack', addr: 'feedback@slack.com', sub: 'Баг руу урилга', type: 'legit' },
  ];

  samples.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = `hero-email-card ${s.type}`;
    card.innerHTML = `<div class="e-from">${s.from}</div><div class="e-sub">${s.addr}</div><div style="margin-top:4px;opacity:.6">${s.sub}</div>`;
    const side = i % 2 === 0 ? (5 + Math.random() * 12) : (78 + Math.random() * 12);
    card.style.left = side + '%';
    card.style.top = (15 + Math.random() * 65) + '%';
    card.style.animationDelay = (i * 2.1) + 's';
    card.style.animationDuration = (10 + Math.random() * 8) + 's';
    card.style.transform = `rotate(${(Math.random() - .5) * 8}deg)`;
    container.appendChild(card);
  });
}
spawnHeroEmails();

/* ==================================================
   LIVE THREAT FEED (right panel)
   ================================================== */
(function initLiveFeed() {
  const feedData = [
    { from: 'PayPal Security', color: '#003087', initials: 'PS', subject: '⚠️ Акаунт хязгаарлагдсан — яаралтай!', type: 'phish', time: '0:12' },
    { from: 'Google', color: '#4285F4', initials: 'G', subject: 'Mac дээрх Chrome-д шинэ нэвтрэлт', type: 'legit', time: '1:34' },
    { from: 'Apple ID', color: '#555', initials: 'AI', subject: '🚨 Танигдаагүй газраас нэвтрэлт', type: 'phish', time: '2:05' },
    { from: 'Хаан Банк хөм', color: '#0066cc', initials: 'ХБ', subject: '⚠️ Карт хаагдахаас өмнө баталгаажуул', type: 'phish', time: '3:18' },
    { from: 'Slack', color: '#4A154B', initials: 'SL', subject: 'Acme Corp-д урьсан байна 🎉', type: 'legit', time: '4:42' },
    { from: 'Microsoft', color: '#00A4EF', initials: 'MS', subject: '🚨 Таны компьютерт вирус илэрлээ!', type: 'phish', time: '5:57' },
    { from: 'GitHub', color: '#24292e', initials: 'GH', subject: 'Pull request нэгтгэгдлээ ✅', type: 'legit', time: '6:03' },
    { from: 'Нийгмийн даатгал', color: '#2563eb', initials: 'НД', subject: 'Тэтгэмж баталгаажуулах хүсэлт', type: 'phish', time: '7:29' },
  ];

  const feed = document.getElementById('live-feed');
  if (!feed) return;

  let idx = 0;
  function addItem() {
    if (!document.getElementById('live-feed')) return;
    const d = feedData[idx % feedData.length];
    idx++;
    const el = document.createElement('div');
    el.className = `feed-item ${d.type}`;
    el.style.animationDelay = '0s';
    el.innerHTML = `
      <div class="feed-avatar" style="background:${d.color}">${d.initials}</div>
      <div class="feed-content">
        <div class="feed-from">${d.from}</div>
        <div class="feed-subject">${d.subject}</div>
      </div>
      <span class="feed-tag ${d.type}">${d.type === 'phish' ? '🎣 ФИШИНГ' : '✅ ЖИНХЭНЭ'}</span>
    `;
    feed.insertBefore(el, feed.firstChild);
    // Keep max 5 items
    while (feed.children.length > 5) feed.removeChild(feed.lastChild);
  }

  // Add initial items with delay
  feedData.slice(0, 4).forEach((_, i) => {
    setTimeout(addItem, i * 600);
  });
  // Continue cycling
  setInterval(addItem, 3200);

  // Animate attack counter
  const numEl = document.getElementById('attack-num');
  if (!numEl) return;
  let count = 0;
  const target = 24817;
  const duration = 2200;
  const step = Math.ceil(target / (duration / 30));
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    numEl.textContent = count.toLocaleString();
    if (count >= target) {
      clearInterval(timer);
      // Keep incrementing slowly
      setInterval(() => {
        count += Math.floor(Math.random() * 3) + 1;
        numEl.textContent = count.toLocaleString();
      }, 1800);
    }
  }, 30);
})();

/* ==================================================
   ROTATING PHISHING FACTS TICKER
   ================================================== */
(function initFactTicker() {
  const facts = [
    { icon: '📊', stat: '91%', text: 'Кибер халдлагын <strong style="color:var(--white)">91%</strong> нь фишинг имэйлээс эхэлдэг. Домэйн нэрийг үргэлж шалга!' },
    { icon: '⏱️', stat: '3сек', text: 'Дэлхийд <strong style="color:var(--white)">3 секунд</strong> тутамд нэг фишинг халдлага амжилттай болдог.' },
    { icon: '💸', stat: '$17,700', text: 'Фишинг халдлага бүрт байгууллага дунджаар <strong style="color:var(--white)">$17,700</strong> алддаг.' },
    { icon: '🎯', stat: '74%', text: 'Нийт мэдээллийн зөрчлийн <strong style="color:var(--white)">74%</strong> нь хүний алдаа — фишинг л голлох шалтгаан.' },
    { icon: '📱', stat: '3.4B', text: 'Өдөр бүр <strong style="color:var(--white)">3.4 тэрбум</strong> хуурамч фишинг имэйл илгээгддэг — дэлхийн хүн амаас 2 дахин их!' },
    { icon: '🏦', stat: '1-р байр', text: 'Санхүүгийн байгууллагууд — банк, PayPal — фишингийн <strong style="color:var(--white)">хамгийн их</strong> дуурайгддаг брэнд.' },
    { icon: '🤖', stat: 'AI', text: '<strong style="color:var(--white)">AI фишинг</strong> имэйл илрүүлэхэд 98% хэцүү — ChatGPT-ийн нөлөөгөөр хурдацтай нэмэгдэж байна.' },
    { icon: '🇲🇳', stat: 'МН', text: 'Монголд фишинг халдлага <strong style="color:var(--white)">2023-2024 онд 3 дахин</strong> нэмэгдсэн. Хаан Банк, TDB хамгийн их дуурайгддаг.' },
    { icon: '🔗', stat: 'URL', text: 'Фишинг сайтуудын <strong style="color:var(--white)">77%</strong> нь HTTPS ашигладаг — "🔒 аюулгүй" тэмдэг хуурамч байж болно!' },
    { icon: '⚡', stat: '82сек', text: 'Хохирогч фишинг хуудсанд хандсанаас <strong style="color:var(--white)">82 секундын</strong> дотор нэвтрэх мэдээллээ оруулдаг.' },
  ];

  const contentEl = document.getElementById('fact-content');
  const textEl = document.getElementById('fact-text');
  const dotsEl = document.getElementById('fact-dots');
  if (!contentEl || !dotsEl) return;

  // Create dots
  facts.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.style.cssText = `width:5px;height:5px;border-radius:50%;background:${i===0?'var(--cyan)':'rgba(6,214,245,.25)'};transition:background .3s`;
    dotsEl.appendChild(dot);
  });

  let current = 0;

  function showFact(idx) {
    const f = facts[idx];
    textEl.style.opacity = '0';
    setTimeout(() => {
      contentEl.innerHTML = f.text;
      // Update icon
      const strong = textEl.querySelector('strong');
      textEl.style.opacity = '1';
    }, 350);
    // Update dots
    Array.from(dotsEl.children).forEach((d, i) => {
      d.style.background = i === idx ? 'var(--cyan)' : 'rgba(6,214,245,.25)';
    });
  }

  setInterval(() => {
    current = (current + 1) % facts.length;
    showFact(current);
  }, 5000);
})();

const questions = [
  {
    type: 'legit', difficulty: 'hard',
    from: { name: 'Google', email: 'no-reply@accounts.google.com', color: '#EA4335', initials: 'G' },
    subject: 'Таны Google Бүртгэлийг амжилттай сэргээлээ',
    urlBar: 'accounts.google.com/security',
    body: `<div style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;padding:20px 28px;margin-bottom:4px;font-family:Arial,sans-serif">
<div style="text-align:center;margin-bottom:16px">
  <svg width="74" height="24" viewBox="0 0 74 24" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="20" font-family="Arial,sans-serif" font-size="22" font-weight="400">
      <tspan fill="#4285F4">G</tspan><tspan fill="#EA4335">o</tspan><tspan fill="#FBBC05">o</tspan><tspan fill="#4285F4">g</tspan><tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan>
    </text>
  </svg>
</div>
<div style="text-align:center;font-size:20px;font-weight:400;color:#202124;margin-bottom:8px">Бүртгэлийг амжилттай сэргээлээ</div>
<div style="text-align:center;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:16px">
  <div style="width:28px;height:28px;border-radius:50%;background:#4285F4;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:600">У</div>
  <span style="font-size:13px;color:#444">uurtsaihgelegmaa@gmail.com</span>
</div>
<hr style="border:none;border-top:1px solid #e0e0e0;margin:0 0 16px">
<div style="font-size:14px;font-weight:600;color:#202124;margin-bottom:8px">Бүртгэлдээ дахин тавтай морилно уу</div>
<div style="font-size:13px;color:#444;line-height:1.6">Хэрэв та хэн нэгний хийсэн өөрчлөлтийн улмаас бүртгэлдээ нэвтэрч чадахгүй түгжигдсэн гэж үзвэл <span style="color:#1a73e8">бүртгэлээ шалгаад &amp; хамгаална уу</span>.</div>
</div>
<div style="text-align:center;font-size:11px;color:#666;line-height:1.5;margin-top:8px">Таны Google Бүртгэл болон үйлчилгээний чухал өөрчлөлтийг мэдэгдэхийн тулд энэ имэйлийг илгээсэн болно.<br>© 2026 Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</div>`,
    link: 'Бүртгэлээ Шалгах',
    linkColor: '#1a73e8',
    hint: '✅ Энэ бол Google-ийн <strong>жинхэнэ</strong> имэйл. Илгээгч нь <strong>no-reply@accounts.google.com</strong> — Google-ийн албан ёсны домэйн. URL баар нь <strong>accounts.google.com</strong>. Ямар ч нууц мэдээлэл нэхэхгүй, яаралтай аюул заналхийлэл байхгүй.'
  },
  {
    type: 'phish', difficulty: 'easy',
    from: { name: 'PayPal Security', email: 'security@paypa1-verify.com', color: '#003087', initials: 'PS' },
    subject: '⚠️ Таны акаунт хязгаарлагдсан байна!',
    urlBar: 'paypa1-verify.com/account/secure',
    body: `Таны PayPal акаунт сэжигтэй үйл ажиллагааны улмаас <strong>түр хязгаарлагдсан</strong> байна.<br><br>
Акаунтаа бүрэн сэргээхийн тулд мэдээллээ яаралтай баталгаажуулна уу. <strong>24 цагийн</strong> дотор баталгаажуулаагүй тохиолдолд акаунт <strong>байнга хаагдах</strong> болно.`,
    link: 'Акаунтаа Одоо Баталгаажуулах →',
    linkColor: '#003087',
    hint: '🔍 <strong>"paypa1-verify.com"</strong> — "l" үсгийн оронд "1" тоо ашигласан. URL баар-г анхаарч үзэх хэрэгтэй. Яаралтай хэл болон аюул заналхийлэх нь сонгодог фишинг тактик.'
  },
  {
    type: 'legit', difficulty: 'easy',
    from: { name: 'GitHub', email: 'noreply@github.com', color: '#24292e', initials: 'GH' },
    subject: 'Таны pull request нэгтгэгдлээ ✅',
    urlBar: 'mail.github.com/notifications',
    body: `Сайн байна уу,<br><br>
Таны pull request <strong>#1247 — "Fix login button alignment"</strong> хэрэглэгч <strong>@devlead</strong> <em>main</em> branch руу нэгтгэлээ.<br><br>
CI/CD pipeline амжилттай дууслаа. Таны өөрчлөлт <strong>production дээр идэвхтэй</strong> байна.`,
    link: 'Pull Request #1247 Харах',
    linkColor: '#2563eb',
    hint: '✅ GitHub-ийн жинхэнэ мэдэгдэл — домэйн <strong>github.com</strong>, агуулга техникийн шинжтэй, яаралтай байдал эсвэл аюул заналхийлэл огт байхгүй.'
  },
  {
    type: 'phish', difficulty: 'medium',
    from: { name: 'Apple ID Support', email: 'appleid@apple-id-secure.net', color: '#555', initials: 'AI' },
    subject: '🚨 Таны Apple ID танигдаагүй газраас нэвтрэв',
    urlBar: 'apple-id-secure.net/verify',
    body: `Таны Apple ID танигдаагүй төхөөрөмжөөс нэвтэрсэн байна.<br><br>
📍 <strong>Москва, Орос — Windows PC</strong><br>
🕐 Цаг: Өнөөдөр <strong>03:47</strong><br><br>
Хэрэв энэ та биш бол таны акаунт <strong>аюулд орсон</strong> байж болзошгүй. Доорх товчийг яаралтай дарна уу.`,
    link: '🔒 Apple ID-гаа Одоо Хамгаалах',
    linkColor: '#555',
    hint: '🔍 <strong>"apple-id-secure.net"</strong> — Apple-ийн жинхэнэ домэйн нь <strong>apple.com</strong> байдаг. ".net" домэйн ашигласан нь хуурамч. Зөвшөөрөлгүй нэвтрэлтийн мэдэгдэл хэлбэрийн айлган сүрдүүлэх нь нийтлэг фишинг арга.'
  },
  {
    type: 'legit', difficulty: 'medium',
    from: { name: 'Google', email: 'no-reply@accounts.google.com', color: '#4285F4', initials: 'G' },
    subject: 'Mac дээрх Chrome-д шинэ нэвтрэлт',
    urlBar: 'accounts.google.com/security-notifications',
    body: `Таны Google акаунтад шинэ нэвтрэлт илэрлээ.<br><br>
📅 <strong>Даваа гараг, 3-р сарын 29 · 09:15</strong><br>
💻 macOS дээрх Chrome · 📍 Улаанбаатар, Монгол<br><br>
Хэрэв энэ та бол <strong>юу ч хийх шаардлагагүй</strong>. Үгүй бол доорх товчийг дарж шалгана уу.`,
    link: 'Үйл Ажиллагаа Шалгах',
    linkColor: '#4285F4',
    hint: '✅ Google-ийн жинхэнэ аюулгүй байдлын имэйл — <strong>@accounts.google.com</strong> хаягаас ирсэн. Аймшигтай хэл болон хиймэл яаралтай байдал огт байхгүй.'
  },
  {
    type: 'phish', difficulty: 'medium',
    from: { name: 'Amazon Order', email: 'orders@amazon-delivery-update.co', color: '#FF9900', initials: 'AM' },
    subject: '📦 Таны багц хүргэгдэх боломжгүй байна',
    urlBar: 'amazon-delivery-update.co/reship',
    body: `Таны захиалгыг <strong>бүрэн бус хаяг</strong>ийн улмаас хүргэх боломжгүй байна.<br><br>
📦 Захиалга <strong>#302-8827463-9912847</strong><br>
⏳ Манай агуулахад <strong>48 цаг</strong> л хадгалагдана.<br><br>
Хүргэлтийг дахин товлохын тулд хаягаа шинэчилж <strong>$1.99 дахин хүргэлтийн төлбөр</strong> төлнө үү.`,
    link: '💳 Хаяг Шинэчлэх & Төлөх',
    linkColor: '#FF9900',
    hint: '🔍 Amazon хэзээ ч <strong>"amazon-delivery-update.co"</strong> гэх домэйн ашигладаггүй. Дахин хүргэлтэд мөнгө нэхэх нь томоохон анхааруулга — Amazon хүргэлтийн асуудлыг зөвхөн албан ёсны app-аараа шийддэг.'
  },
  {
    type: 'legit', difficulty: 'easy',
    from: { name: 'Slack', email: 'feedback@slack.com', color: '#4A154B', initials: 'SL' },
    subject: 'Slack дээр Acme Corp-д урьсан байна 🎉',
    urlBar: 'slack.com/intl/mn/invites',
    body: `<strong>Жон Смит</strong> танийг Slack дээрх <strong>Acme Corp</strong> ажлын орон зайд урьж байна.<br><br>
Урилгыг хүлээн авч профайлаа тохируулснаар эхлээрэй. Та багтайгаа <strong>хаанаас ч хамтран ажиллах</strong> боломжтой.`,
    link: '→ Ажлын Орон Зайд Нэгдэх',
    linkColor: '#4A154B',
    hint: '✅ Албан ёсны <strong>feedback@slack.com</strong> хаягаас ирсэн стандарт Slack урилга. Яаралтай байдал эсвэл аюул заналхийлэл байхгүй — зүгээр л энгийн багийн урилга.'
  },
  {
    type: 'phish', difficulty: 'hard',
    from: { name: 'IT Department', email: 'it-support@company-helpdesk.xyz', color: '#3b82f6', initials: 'IT' },
    subject: '🚨 ЯАРАЛТАЙ: Нууц үг 1 цагийн дотор дуусна',
    urlBar: 'company-helpdesk.xyz/password-reset',
    body: `<strong>⚡ ЯАРАЛТАЙ ҮЙЛДЭЛ ШААРДЛАГАТАЙ</strong><br><br>
Таны сүлжээний нууц үг <strong>60 минутын</strong> дотор дуусна. Компанийн бүх системд нэвтрэх эрхээ алдахгүйн тулд нууц үгээ яаралтай сэлбэнэ үү.<br><br>
Энэ бол таны <strong>сүүлчийн сануулга</strong>. Доорх товчийг дарж одоо сэлбэнэ үү.`,
    link: '🔑 Нууц Үг Шинэчлэх (60 мин үлдсэн)',
    linkColor: '#dc2626',
    hint: '🔍 Жинхэнэ IT хэлтэс гадны <strong>".xyz"</strong> домэйн биш, компанийн өөрийн домэйн ашигладаг. "60 минут!" гэх экстрем яаралтай байдал нь хүнийг сандруулж, шалгалгүй дарахад хүргэх арга техник.'
  },
  {
    type: 'legit', difficulty: 'medium',
    from: { name: 'Netflix', email: 'info@mailer.netflix.com', color: '#E50914', initials: 'NF' },
    subject: 'Netflix — Энэ сарын шинэ нэмэлтүүд 🎬',
    urlBar: 'mailer.netflix.com/recommendations',
    body: `Сайн байна уу,<br><br>
Таны үзсэн зүйлд үндэслэн энэ сарын шинэ нэмэлтүүдийг танд таалагдана гэж бодож байна:<br><br>
🎬 <strong>Цувралын санал 1</strong> — Шинэ улирал<br>
🎬 <strong>Цувралын санал 2</strong> — Шинэ нэмэлт<br>
🎬 <strong>Баримтат кино</strong> — Онцлох`,
    link: '▶ Одоо Үзэх',
    linkColor: '#E50914',
    hint: '✅ Netflix маркетингийн имэйлдээ <strong>mailer.netflix.com</strong> ашигладаг. Яаралтай байдал, хувийн мэдээлэл нэхэх, аюул заналхийлэл огт байхгүй — энгийн зөвлөмжийн имэйл.'
  },
  {
    type: 'phish', difficulty: 'hard',
    from: { name: 'Bank of America', email: 'alert@bofa-secure-notification.com', color: '#e31837', initials: 'BoA' },
    subject: '⚠️ Таны акаунтаас сэжигтэй гүйлгээ илэрлээ',
    urlBar: 'bofa-secure-notification.com/verify',
    body: `Таны Bank of America акаунтаас <strong>зөвшөөрөлгүй $847.00 гүйлгээ</strong> илэрлээ.<br><br>
📍 Байршил: <strong>Нью-Йорк, АНУ</strong><br>
🕐 Цаг: Өнөөдөр <strong>02:13</strong><br><br>
Энэ төлбөрийг маргаан болгож акаунтаа хамгаалахын тулд онлайн банкны нэвтрэх мэдээллээ оруулж өгнө үү. <strong>2 цагийн дотор</strong> арга хэмжээ аваагүй бол таны акаунт хөлдөөгдөх болно.`,
    link: '🔐 Хэрэглэгчийн Мэдээлэл Баталгаажуулах',
    linkColor: '#e31837',
    hint: '🔍 Жинхэнэ банкнууд хэзээ ч имэйлээр нэвтрэх мэдээлэл асуудаггүй. <strong>"bofa-secure-notification.com"</strong> нь Bank of America-ийн жинхэнэ домэйн <strong>bankofamerica.com</strong> БИШ. 2 цагийн хугацаа хиймэл дарамт.'
  },
  {
    type: 'legit', difficulty: 'hard',
    from: { name: 'Dropbox', email: 'no-reply@dropbox.com', color: '#0061FF', initials: 'DB' },
    subject: 'Сара танд хавтас хуваалцлаа 📁',
    urlBar: 'dropbox.com/share-notification',
    body: `<strong>Сара Жонсон</strong> танд Dropbox дээр хавтас хуваалцлаа.<br><br>
📁 <strong>"Q1 2026 Reports"</strong><br>
📊 8 файл · 42 MB<br><br>
Та файлуудыг хэдийд ч харж, татаж авах боломжтой.`,
    link: '📂 Хавтас Нээх',
    linkColor: '#0061FF',
    hint: '✅ Албан ёсны <strong>no-reply@dropbox.com</strong> хаягаас ирсэн жинхэнэ Dropbox мэдэгдэл. Тодорхой, аюул заналхийлэлгүй хамтран ажиллах энгийн мэдэгдэл.'
  }
];

/* ==================================================
   GAME STATE
   ================================================== */
let username = '', current = 0, score = 0;
let answered = false, prevScreen = 'login-screen';
let selectedAge = '';
const answerLog = [];
const answers_arr = new Array(10).fill(null);
const TIMER_MAX = 20;
let timerLeft = TIMER_MAX, timerInterval = null;
let gameStartTime = 0, questionStartTime = 0;
const CIRCUMFERENCE = 2 * Math.PI * 18;

/* Age group question pools */
const questionsByAge = {
  '6-18': [
    {
      type: 'phish', difficulty: 'easy',
      from: { name: 'Roblox Support', email: 'support@roblox-free-robux.com', color: '#e3232c', initials: 'RB' },
      subject: '🎮 Чөлөөт 10,000 Robux авах боломж!',
      urlBar: 'roblox-free-robux.com/claim',
      body: `Баяр хүргэе! Та <strong>10,000 Robux-ийн шагнал</strong> хожлоо.<br><br>
Шагналаа авахын тулд Roblox акаунтынхаа нэвтрэх мэдээллийг оруулна уу.<br><br>
⏰ <strong>Зөвхөн 15 минут</strong> л хүчинтэй!`,
      link: '🎁 Robux Авах',
      linkColor: '#e3232c',
      hint: '🔍 Roblox хэзээ ч "roblox-free-robux.com" гэх домэйн ашигладаггүй. <strong>Үнэгүй Robux өгнө</strong> гэдэг нь бараг үргэлж луйвар! Акаунтын мэдээллээ хэзээ ч бусдад өгч болохгүй.'
    },
    {
      type: 'legit', difficulty: 'easy',
      from: { name: 'YouTube', email: 'no-reply@youtube.com', color: '#FF0000', initials: 'YT' },
      subject: '📺 Таны захиалсан суваг шинэ видео оруулав',
      urlBar: 'youtube.com/notifications',
      body: `Та захиалсан <strong>MineCraft Tutorials MN</strong> сувагт шинэ видео нийтлэгдлээ.<br><br>
🎬 <strong>"Top 10 Survival Tips 2024"</strong><br>
⏱ 15:42 | 👁 12K үзэгч`,
      link: '▶ Видео Үзэх',
      linkColor: '#FF0000',
      hint: '✅ YouTube-ийн жинхэнэ мэдэгдэл — <strong>no-reply@youtube.com</strong> хаягаас ирсэн. Ямар ч мэдээлэл нэхэхгүй, зөвхөн шинэ видеоны тухай мэдэгдэж байна.'
    },
    {
      type: 'phish', difficulty: 'easy',
      from: { name: 'Minecraft Team', email: 'team@minecraft-gift.net', color: '#5d9b43', initials: 'MC' },
      subject: '🎁 Үнэгүй Minecraft Premium аккаунт хожлоо!',
      urlBar: 'minecraft-gift.net/premium/claim',
      body: `Чамайг Minecraft Premium тоглогч болгохоор <strong>сонгогдлоо</strong>.<br><br>
Таны нэрийг шагналын жагсаалтаас олсон.<br><br>
Шагналаа авахын тулд <strong>Microsoft акаунтынхаа</strong> нэвтрэх мэдээллийг оруулна уу.`,
      link: '🏆 Premium Авах',
      linkColor: '#5d9b43',
      hint: '🔍 <strong>"minecraft-gift.net"</strong> нь Minecraft-ийн жинхэнэ домэйн биш. Minecraft нь <strong>minecraft.net</strong> ашигладаг. "Тусгайлан сонгогдлоо" гэдэг нь луйварчдын нийтлэг арга!'
    },
    {
      type: 'legit', difficulty: 'medium',
      from: { name: 'Discord', email: 'noreply@discord.com', color: '#5865F2', initials: 'DC' },
      subject: 'Таны Discord серверт шинэ гишүүн нэгдлээ 👋',
      urlBar: 'discord.com/notifications',
      body: `<strong>MongoGamer_MN</strong> таны <strong>"Mongolian Gamers"</strong> серверт нэгдлээ.<br><br>
Серверт нийт <strong>142 гишүүн</strong> байна.`,
      link: 'Сервер Харах',
      linkColor: '#5865F2',
      hint: '✅ Discord-ийн жинхэнэ мэдэгдэл — <strong>noreply@discord.com</strong> хаягаас ирсэн. Ямар ч хувийн мэдээлэл эсвэл нэвтрэх мэдээлэл нэхэхгүй байна.'
    },
    {
      type: 'phish', difficulty: 'medium',
      from: { name: 'TikTok Verify', email: 'verify@tiktok-creator-fund.xyz', color: '#010101', initials: 'TT' },
      subject: '⭐ Таны TikTok акаунт баталгаажуулагдах боломжтой!',
      urlBar: 'tiktok-creator-fund.xyz/verify',
      body: `Таны TikTok акаунт <strong>баталгаажсан тэмдэг</strong> авах боломжтой болоод байна!<br><br>
Creator Fund-д бүртгүүлж баталгаажуулалт авах.<br><br>
⏰ Энэ урилга <strong>24 цаг</strong> л хүчинтэй.`,
      link: '✔️ Акаунт Баталгаажуулах',
      linkColor: '#010101',
      hint: '🔍 TikTok-ийн жинхэнэ домэйн нь <strong>tiktok.com</strong> байдаг — <strong>".xyz"</strong> домэйн ашигласан нь луйвар. TikTok баталгаажуулалтыг зөвхөн аппын дотор хийдэг, имэйлээр биш.'
    },
    {
      type: 'legit', difficulty: 'medium',
      from: { name: 'Google', email: 'no-reply@accounts.google.com', color: '#4285F4', initials: 'G' },
      subject: 'Таны Google акаунтад шинэ нэвтрэлт',
      urlBar: 'accounts.google.com/security',
      body: `Таны Google акаунтад шинэ нэвтрэлт илэрлээ.<br><br>
💻 Chrome · 📍 Улаанбаатар, Монгол<br>
📅 <strong>Өнөөдөр 14:22</strong><br><br>
Хэрэв энэ та бол юу ч хийх шаардлагагүй.`,
      link: 'Үйл Ажиллагаа Шалгах',
      linkColor: '#4285F4',
      hint: '✅ Google-ийн жинхэнэ мэдэгдэл — <strong>@accounts.google.com</strong> хаягаас ирсэн. Яаралтай байдал эсвэл нэвтрэх мэдээлэл нэхэхгүй байна.'
    },
    {
      type: 'phish', difficulty: 'hard',
      from: { name: 'Steam Support', email: 'support@steam-trade-secure.com', color: '#1b2838', initials: 'ST' },
      subject: '🔒 Таны Steam Trade Offer хүлээгдэж байна',
      urlBar: 'steam-trade-secure.com/trade/confirm',
      body: `Таны Steam акаунтад <strong>Trade Offer</strong> ирсэн байна.<br><br>
🎮 Тоглоом: <strong>CS2 Knife (Factory New)</strong><br>
💰 Үнэ цэнэ: $450+<br><br>
Баталгаажуулахын тулд <strong>Steam Guard кодоо</strong> оруулна уу.`,
      link: '✅ Trade Баталгаажуулах',
      linkColor: '#1b2838',
      hint: '🔍 <strong>"steam-trade-secure.com"</strong> нь Steam-ийн домэйн биш — жинхэнэ нь <strong>steampowered.com</strong>. Steam Guard кодоо гуравдагч этгээдэд хэзээ ч өгч болохгүй!'
    },
    {
      type: 'legit', difficulty: 'hard',
      from: { name: 'Spotify', email: 'no-reply@spotify.com', color: '#1DB954', initials: 'SP' },
      subject: 'Таны Spotify Premium дуусч байна 🎵',
      urlBar: 'spotify.com/account/subscription',
      body: `Таны Spotify Premium захиалга <strong>7 хоногийн дотор</strong> дуусна.<br><br>
Үргэлжлүүлэн сонсох бол захиалгаа шинэчилнэ үү.<br><br>
📅 Дуусах огноо: <strong>2024-04-15</strong>`,
      link: 'Захиалга Шинэчлэх',
      linkColor: '#1DB954',
      hint: '✅ Spotify-ийн жинхэнэ мэдэгдэл — <strong>no-reply@spotify.com</strong> хаягаас ирсэн. Тодорхой огноотой, ямар ч яаралтай аюул заналхийлэл байхгүй.'
    },
    {
      type: 'phish', difficulty: 'hard',
      from: { name: 'Free VPN Pro', email: 'admin@freevpn-pro-download.net', color: '#6366f1', initials: 'VP' },
      subject: '🔓 Үнэгүй VPN — Хязгааргүй хандалт авах',
      urlBar: 'freevpn-pro-download.net/install',
      body: `Таны сүлжээний <strong>аюулгүй байдал эрсдэлтэй</strong> байна!<br><br>
Манай үнэгүй VPN-ийг суулгаснаар:<br>
✅ Бүх вэбсайтад хандах<br>
✅ Таны мэдээллийг хамгаалах<br><br>
⚡ Одоо татаж аваарай — 1000 хэрэглэгчид үлдсэн!`,
      link: '📥 VPN Татаж Авах',
      linkColor: '#6366f1',
      hint: '🔍 Танигдаагүй хаягаас ирсэн "үнэгүй" програм суулгах хүсэлт нь маш аюултай. Ийм програм таны төхөөрөмжид <strong>хортой код</strong> суулгаж, мэдээллийг хулгайлж болно.'
    },
    {
      type: 'legit', difficulty: 'easy',
      from: { name: 'Gmail', email: 'no-reply@accounts.google.com', color: '#EA4335', initials: 'GM' },
      subject: '📧 Таны Google Drive-д файл хуваалцлагдлаа',
      urlBar: 'accounts.google.com/drive-share',
      body: `<strong>Багш Д.Болд</strong> танд Google Drive дээр файл хуваалцлаа.<br><br>
📄 <strong>"11-р ангийн математик даалгавар.pdf"</strong><br>
📁 Хэмжээ: 2.4 MB`,
      link: '📂 Файл Харах',
      linkColor: '#EA4335',
      hint: '✅ Google Drive-ийн жинхэнэ мэдэгдэл. Домэйн нь <strong>accounts.google.com</strong>, агуулга тодорхой, ямар ч хувийн мэдээлэл нэхэхгүй байна.'
    }
  ],
  '18-35': [
    // Use the original questions set (already defined above as `questions`)
  ],
  '35-60': [
    {
      type: 'phish', difficulty: 'easy',
      from: { name: 'Хаан Банк', email: 'security@khanbank-verify.com', color: '#0066cc', initials: 'ХБ' },
      subject: '⚠️ Таны банкны карт хаагдахаас өмнө баталгаажуулна уу',
      urlBar: 'khanbank-verify.com/card/activate',
      body: `Таны Хаан Банкны карт <strong>системийн шинэчлэлтийн улмаас</strong> 24 цагийн дараа хаагдах болно.<br><br>
Картаа идэвхтэй байлгахын тулд мэдээллээ <strong>яаралтай баталгаажуулна</strong> уу.<br><br>
PIN болон карт дугаараа оруулж баталгаажуулна уу.`,
      link: '🔐 Карт Баталгаажуулах',
      linkColor: '#0066cc',
      hint: '🔍 <strong>"khanbank-verify.com"</strong> нь Хаан Банкны жинхэнэ домэйн биш. Банкнууд хэзээ ч имэйлээр PIN эсвэл карт дугаар асуудаггүй. Ийм имэйл ирвэл банкаа шууд залгаарай!'
    },
    {
      type: 'legit', difficulty: 'easy',
      from: { name: 'Khan Bank', email: 'notification@khanbank.mn', color: '#0066cc', initials: 'ХБ' },
      subject: 'Таны данснаас шилжүүлэг хийгдлээ',
      urlBar: 'khanbank.mn/notifications',
      body: `Таны дансны гүйлгээний мэдэгдэл:<br><br>
💳 Данс: <strong>****5892</strong><br>
💰 Шилжүүлсэн: <strong>₮150,000</strong><br>
📅 Огноо: <strong>2024-03-15 14:30</strong><br><br>
Хэрэв энэ гүйлгээ та биш хийсэн бол <strong>1800-1234</strong> дугаарт залгана уу.`,
      link: 'Гүйлгээ Шалгах',
      linkColor: '#0066cc',
      hint: '✅ Хаан Банкны жинхэнэ мэдэгдэл — <strong>@khanbank.mn</strong> домэйнаас ирсэн. Гүйлгээний дугаар тодорхой, банкны утасны дугаар зөв байна.'
    },
    {
      type: 'phish', difficulty: 'easy',
      from: { name: 'Нийгмийн даатгал', email: 'info@ndaatgal-payment.org', color: '#2563eb', initials: 'НД' },
      subject: '📋 Таны тэтгэвэр/тэтгэмж олгох хүсэлт баталгаажуулах',
      urlBar: 'ndaatgal-payment.org/verify',
      body: `Таны нийгмийн даатгалын <strong>тэтгэмж олгох хүсэлт</strong> бүртгэгдлээ.<br><br>
Олголтоо авахын тулд иргэний үнэмлэхийн дугаар болон банкны дансны мэдээллийг оруулна уу.<br><br>
⏰ Хугацаа: <strong>48 цаг</strong>`,
      link: 'Мэдээлэл Оруулах',
      linkColor: '#2563eb',
      hint: '🔍 Нийгмийн даатгалын газрын жинхэнэ домэйн нь <strong>ndaatgal.mn</strong>. Имэйлээр иргэний дугаар болон банкны мэдээлэл асуудаггүй — энэ нь луйвар!'
    },
    {
      type: 'legit', difficulty: 'medium',
      from: { name: 'Google', email: 'no-reply@accounts.google.com', color: '#4285F4', initials: 'G' },
      subject: 'Таны Gmail акаунтад шинэ нэвтрэлт',
      urlBar: 'accounts.google.com/security',
      body: `Таны Google акаунтад шинэ нэвтрэлт илэрлээ.<br><br>
📅 <strong>2024-03-15 · 09:15</strong><br>
💻 Chrome · 📍 Улаанбаатар, Монгол<br><br>
Хэрэв энэ та бол юу ч хийх шаардлагагүй.`,
      link: 'Үйл Ажиллагаа Шалгах',
      linkColor: '#4285F4',
      hint: '✅ Google-ийн жинхэнэ аюулгүй байдлын имэйл. Домэйн нь <strong>@accounts.google.com</strong>, ямар ч яаралтай аюул байхгүй.'
    },
    {
      type: 'phish', difficulty: 'medium',
      from: { name: 'Amazon Mongolia', email: 'orders@amazon-mn-delivery.co', color: '#FF9900', initials: 'AM' },
      subject: '📦 Таны захиалга хүргэгдэх боломжгүй',
      urlBar: 'amazon-mn-delivery.co/reship',
      body: `Таны захиалгыг хүргэх боломжгүй болоод байна.<br><br>
📦 Захиалга: <strong>#MN-88274639</strong><br>
⏳ Агуулахад <strong>48 цаг</strong> л хадгалагдана.<br><br>
Хаягаа шинэчилж <strong>$2.99 дахин хүргэлтийн төлбөр</strong> төлнө үү.`,
      link: '💳 Хаяг Шинэчлэх',
      linkColor: '#FF9900',
      hint: '🔍 Amazon хэзээ ч <strong>"amazon-mn-delivery.co"</strong> гэх домэйн ашигладаггүй. Хүргэлтэд нэмэлт мөнгө нэхэх нь луйвар — Amazon-ийн аппаа ашигла!'
    },
    {
      type: 'phish', difficulty: 'medium',
      from: { name: 'Microsoft Support', email: 'support@microsoft-security-alert.net', color: '#00A4EF', initials: 'MS' },
      subject: '🚨 Таны компьютерт вирус илэрлээ!',
      urlBar: 'microsoft-security-alert.net/scan',
      body: `<strong>⚠️ АЮУЛ ИЛЭРЛЭЭ!</strong><br><br>
Таны компьютерт <strong>3 вирус</strong> илэрлээ. Системийн мэдээлэл алдагдаж болзошгүй.<br><br>
Microsoft-ийн техникийн баг <strong>одоо</strong> туслахад бэлэн байна. Доорх товчийг дарж холбогдоно уу.`,
      link: '📞 Microsoft-тай Холбогдох',
      linkColor: '#00A4EF',
      hint: '🔍 <strong>"microsoft-security-alert.net"</strong> нь Microsoft-ийн домэйн биш. Microsoft хэзээ ч имэйлээр "вирус илэрлээ" гэж мэдэгддэггүй. Энэ бол "техникийн дэмжлэгийн луйвар" арга!'
    },
    {
      type: 'legit', difficulty: 'medium',
      from: { name: 'Dropbox', email: 'no-reply@dropbox.com', color: '#0061FF', initials: 'DB' },
      subject: 'Хамт олон танд файл хуваалцлаа 📁',
      urlBar: 'dropbox.com/share-notification',
      body: `<strong>Н.Мөнхбаяр</strong> танд Dropbox дээр хавтас хуваалцлаа.<br><br>
📁 <strong>"2024 Татварын баримтууд"</strong><br>
📊 12 файл · 15 MB`,
      link: '📂 Хавтас Нээх',
      linkColor: '#0061FF',
      hint: '✅ Dropbox-ийн жинхэнэ мэдэгдэл — <strong>no-reply@dropbox.com</strong> хаягаас ирсэн. Ямар ч яаралтай байдал эсвэл нэвтрэх мэдээлэл нэхэхгүй байна.'
    },
    {
      type: 'phish', difficulty: 'hard',
      from: { name: 'Монгол Шуудан', email: 'info@mongolpost-delivery.com', color: '#cc0000', initials: 'МШ' },
      subject: '📮 Таны илгээмж гаалийн хяналтанд байна',
      urlBar: 'mongolpost-delivery.com/customs/pay',
      body: `Таны хүлээн авч буй илгээмж гаалийн хяналтанд байна.<br><br>
📦 Илгээмжийн дугаар: <strong>EE847263901MN</strong><br>
💰 Гаалийн татвар: <strong>₮45,000</strong><br><br>
Татвараа төлөхгүй бол илгээмжийг <strong>буцаана</strong>.`,
      link: '💳 Татвар Төлөх',
      linkColor: '#cc0000',
      hint: '🔍 <strong>"mongolpost-delivery.com"</strong> нь Монгол Шуудангийн жинхэнэ домэйн биш — жинхэнэ нь <strong>mongolpost.mn</strong>. Гаалийн татвар нэхэх имэйл луйвар байдаг!'
    },
    {
      type: 'legit', difficulty: 'hard',
      from: { name: 'Facebook', email: 'security@facebookmail.com', color: '#1877F2', initials: 'FB' },
      subject: 'Таны Facebook акаунтад шинэ нэвтрэлт',
      urlBar: 'facebookmail.com/security-notification',
      body: `Таны Facebook акаунтад шинэ нэвтрэлт илэрлээ.<br><br>
📱 Android утас · 📍 Улаанбаатар<br>
📅 <strong>2024-03-15 · 10:44</strong><br><br>
Энэ та биш бол <strong>нууц үгээ солих</strong> хэрэгтэй.`,
      link: 'Акаунт Хамгаалах',
      linkColor: '#1877F2',
      hint: '✅ Facebook аюулгүй байдлын имэйлдээ <strong>@facebookmail.com</strong> домэйн ашигладаг. Тодорхой мэдээлэлтэй, ямар ч хувийн мэдээлэл нэхэхгүй байна.'
    },
    {
      type: 'phish', difficulty: 'hard',
      from: { name: 'МУ-ын Засгийн газар', email: 'info@gov-mn-payment.org', color: '#c0392b', initials: 'ЗГ' },
      subject: '📋 Таны нэрт улсын буцаан олголт байна',
      urlBar: 'gov-mn-payment.org/refund/claim',
      body: `Монгол Улсын Засгийн газраас иргэдэд <strong>буцаан олголт</strong> хийж байна.<br><br>
💰 Таны нэрт: <strong>₮480,000</strong><br><br>
Мөнгөө авахын тулд банкны дансны мэдээлэл болон иргэний үнэмлэхийн дугаараа оруулна уу.`,
      link: '💰 Мөнгөө Авах',
      linkColor: '#c0392b',
      hint: '🔍 <strong>"gov-mn-payment.org"</strong> нь Монгол Улсын Засгийн газрын жинхэнэ домэйн биш. Засгийн газар имэйлээр буцаан олголт өгдөггүй — иргэний үнэмлэхийн мэдээллийг хэзээ ч имэйлээр бүү өг!'
    }
  ]
};

// New Mongolian bank & app scenarios
const mongolQuestions = [
  {
    type: 'phish', difficulty: 'easy',
    from: { name: 'МонПэй', email: 'support@monpay-secure-mn.com', color: '#ee4035', initials: 'МП' },
    subject: '⚠️ МонПэй данс хөлдөөгдсөн — яаралтай баталгаажуул',
    urlBar: 'monpay-secure-mn.com/verify',
    body: `Таны <strong>МонПэй</strong> данс сэжигтэй үйл ажиллагааны улмаас <strong>түр хөлдөөгдсөн</strong> байна.<br><br>
💳 Данс сэргээх үйлдэл шаардлагатай.<br>
⏳ Хугацаа: <strong>12 цаг</strong><br><br>
Дансаа сэргээхийн тулд нэвтрэх мэдээллээ оруулна уу.`,
    link: '🔓 МонПэй Данс Сэргээх',
    linkColor: '#ee4035',
    hint: '🔍 МонПэй-ийн жинхэнэ домэйн нь <strong>monpay.mn</strong>. "monpay-secure-mn.com" нь хуурамч. МонПэй хэзээ ч имэйлээр нэвтрэх мэдээлэл асуудаггүй — апп дотроо л нэвтэрнэ үү!'
  },
  {
    type: 'legit', difficulty: 'medium',
    from: { name: 'МонПэй', email: 'noreply@monpay.mn', color: '#ee4035', initials: 'МП' },
    subject: 'МонПэй: Таны гүйлгээний баримт',
    urlBar: 'monpay.mn/transaction',
    body: `Гүйлгээний баримт:<br><br>
💸 Дүн: <strong>₮25,000</strong><br>
📍 Хүлээн авагч: <strong>Номын дэлгүүр MN</strong><br>
📅 Огноо: <strong>2026-04-03 · 11:22</strong><br>
🆔 Баримтын дугаар: <strong>TXN-88472</strong>`,
    link: 'Гүйлгээ Шалгах',
    linkColor: '#ee4035',
    hint: '✅ МонПэй-ийн жинхэнэ гүйлгээний мэдэгдэл. Домэйн нь <strong>@monpay.mn</strong>, тодорхой баримтын дугаартай, ямар ч нэмэлт үйлдэл нэхэхгүй байна.'
  },
  {
    type: 'phish', difficulty: 'medium',
    from: { name: 'Голомт Банк', email: 'alert@golomtbank-security.org', color: '#003f8a', initials: 'ГБ' },
    subject: '🚨 Голомт: Таны картаас зөвшөөрөлгүй гүйлгээ',
    urlBar: 'golomtbank-security.org/block',
    body: `Таны Голомт Банкны картаас <strong>зөвшөөрөлгүй гүйлгээ</strong> илэрлээ.<br><br>
💳 Дүн: <strong>₮1,200,000</strong><br>
📍 Байршил: <strong>Сеул, Солонгос</strong><br><br>
Картаа блоклохын тулд PIN болон карт дугаараа оруулна уу.`,
    link: '🛑 Карт Блоклох',
    linkColor: '#003f8a',
    hint: '🔍 <strong>"golomtbank-security.org"</strong> — Голомт Банкны жинхэнэ домэйн нь <strong>golomtbank.mn</strong>. Банк хэзээ ч имэйлээр PIN нэхдэггүй. Сэжигтэй бол <strong>1800-1111</strong> дугаарт залгаарай!'
  },
  {
    type: 'legit', difficulty: 'hard',
    from: { name: 'TDB Bank', email: 'notification@tdbbank.mn', color: '#1a3a6b', initials: 'TDB' },
    subject: 'TDB: Таны зээлийн хуулгын мэдэгдэл',
    urlBar: 'tdbbank.mn/statement',
    body: `Сайн байна уу,<br><br>
Таны <strong>TDB кредит картын</strong> сарын хуулга бэлэн боллоо.<br><br>
📅 Хугацаа: <strong>2026 оны 3-р сар</strong><br>
💳 Нийт зарлага: <strong>₮840,000</strong><br>
📆 Төлбөрийн дэдлайн: <strong>2026-04-15</strong>`,
    link: 'Хуулга Татах',
    linkColor: '#1a3a6b',
    hint: '✅ TDB Банкны жинхэнэ мэдэгдэл — <strong>@tdbbank.mn</strong> домэйнаас ирсэн. Ямар ч нууц мэдээлэл нэхэхгүй, зөвхөн хуулгын мэдэгдэл.'
  },
  {
    type: 'phish', difficulty: 'hard',
    from: { name: 'Мобикомын урамшуулал', email: 'promo@mobicom-gift.net', color: '#e30613', initials: 'МК' },
    subject: '🎁 Мобиком: 50,000₮ кредит хожив! Нэн яаралтай',
    urlBar: 'mobicom-gift.net/claim',
    body: `Баяр хүргэе! Та Мобикомын хэрэглэгчдийн дунд хийсэн сугалаанд хожиж <strong>₮50,000 кредит</strong> авах эрхтэй боллоо!<br><br>
⏰ Урамшуулал <strong>2 цаг</strong> л хүчинтэй.<br><br>
Шагналаа авахын тулд утасны дугаар болон SIM-ийн серийн дугаараа оруулна уу.`,
    link: '🎉 Шагнал Авах',
    linkColor: '#e30613',
    hint: '🔍 Мобикомын жинхэнэ домэйн нь <strong>mobicom.mn</strong>. "mobicom-gift.net" нь хуурамч. SIM серийн дугаар нэхэх нь SIM своппинг халдлагын бэлтгэл — хэзээ ч бүү өг!'
  },
  {
    type: 'legit', difficulty: 'easy',
    from: { name: 'Unitel', email: 'noreply@unitel.mn', color: '#00aeef', initials: 'UN' },
    subject: 'Unitel: Таны сарын дансны мэдэгдэл',
    urlBar: 'unitel.mn/mybill',
    body: `Сайн байна уу,<br><br>
Таны <strong>2026 оны 3-р сарын</strong> дансны мэдэгдэл:<br><br>
📱 Дугаар: <strong>9911-XXXX</strong><br>
💰 Төлөх дүн: <strong>₮29,900</strong><br>
📅 Дэдлайн: <strong>2026-04-20</strong>`,
    link: 'Төлбөр Төлөх',
    linkColor: '#00aeef',
    hint: '✅ Unitel-ийн жинхэнэ дансны мэдэгдэл — <strong>@unitel.mn</strong> домэйнаас ирсэн. Тодорхой дугаар, тодорхой дүнтэй, яаралтай хэл байхгүй.'
  },
  {
    type: 'phish', difficulty: 'medium',
    from: { name: 'E-Mongolia Засгийн газар', email: 'info@e-mongolia-gov.org', color: '#1a56db', initials: 'ЭМ' },
    subject: '📋 E-Mongolia: Таны иргэний үнэмлэх шинэчлэлт шаардлагатай',
    urlBar: 'e-mongolia-gov.org/renew',
    body: `Таны иргэний үнэмлэхний хугацаа дуусч байна.<br><br>
📱 E-Mongolia системд шинэчлэхийн тулд доорх мэдээллийг оруулна уу:<br><br>
• Иргэний үнэмлэхний дугаар<br>
• Регистрийн дугаар<br>
• Нүүр зургийн зураг`,
    link: '🆔 Үнэмлэх Шинэчлэх',
    linkColor: '#1a56db',
    hint: '🔍 E-Mongolia-гийн жинхэнэ домэйн нь <strong>e-mongolia.mn</strong>. Засгийн газар хэзээ ч имэйлээр регистрийн дугаар болон нүүр зураг нэхдэггүй — энэ бол иргэний мэдээллийг хулгайлах луйвар!'
  },
  {
    type: 'legit', difficulty: 'medium',
    from: { name: 'Хаан Банк', email: 'notification@khanbank.mn', color: '#0066cc', initials: 'ХБ' },
    subject: 'Хаан Банк: Таны хадгаламжийн хүү нэмэгдлээ',
    urlBar: 'khanbank.mn/savings',
    body: `Сайн байна уу,<br><br>
Таны <strong>хадгаламжийн данс</strong> дахь хүүгийн мэдэгдэл:<br><br>
💰 Нэмэгдсэн хүү: <strong>₮12,400</strong><br>
📅 Хугацаа: <strong>2026 оны 1-р улирал</strong><br>
🏦 Данс: <strong>****7823</strong><br><br>
Дэлгэрэнгүй мэдээллийг ХБ апп-аас харна уу.`,
    link: 'ХБ Апп Нээх',
    linkColor: '#0066cc',
    hint: '✅ Хаан Банкны жинхэнэ мэдэгдэл — <strong>@khanbank.mn</strong> домэйн. Хүүгийн мэдэгдэл энгийн, нэвтрэх мэдээлэл нэхэхгүй, апп руу чиглүүлж байна.'
  },
];

// Append Mongolian questions to 18-35 pool
questionsByAge['18-35'] = [...questions, ...mongolQuestions].slice(0, 15);
// Add some to 35-60 too
questionsByAge['35-60'] = [...questionsByAge['35-60'], ...mongolQuestions.filter(q=>['МонПэй','Голомт Банк','TDB Bank','E-Mongolia Засгийн газар','Хаан Банк'].includes(q.from.name))];

let activeQuestions = [];

/* ==================================================
   SCREEN MANAGEMENT
   ================================================== */
function showScreen(id) {
  prevScreen = document.querySelector('.screen.active')?.id || 'login-screen';
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'leaderboard-screen') renderLeaderboard();
}
function goBack() { showScreen(prevScreen); }

/* ==================================================
   AGE STEP NAVIGATION
   ================================================== */
function goToAgeStep() {
  const input = document.getElementById('username-input').value.trim();
  const err = document.getElementById('login-error');
  if (!input) { err.style.display = 'block'; document.getElementById('username-input').focus(); return; }
  err.style.display = 'none';
  username = input;
  document.getElementById('age-greeting').textContent = `Сайн байна уу, ${username}! 👋`;
  document.getElementById('step-name').style.display = 'none';
  document.getElementById('step-age').style.display = 'block';
}

function backToName() {
  selectedAge = '';
  document.querySelectorAll('.age-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('step-age').style.display = 'none';
  document.getElementById('step-name').style.display = 'block';
}

function selectAge(age) {
  selectedAge = age;
  document.querySelectorAll('.age-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.age === age);
  });
  document.getElementById('age-error').style.display = 'none';
}

/* ==================================================
   START QUIZ
   ================================================== */
function startQuiz() {
  if (!selectedAge) {
    document.getElementById('age-error').style.display = 'block';
    return;
  }
  activeQuestions = questionsByAge[selectedAge] || questions;
  resetGameState();
  document.getElementById('display-username').textContent = username;
  // Show age badge
  const ageBadge = document.getElementById('age-badge');
  if (ageBadge) ageBadge.textContent = selectedAge === '6-18' ? '🧒 6-18' : selectedAge === '18-35' ? '👨‍💻 18-35' : '👔 35-60+';
  showScreen('quiz-screen');
  renderEmail(activeQuestions[0]);
  buildProgress();
  startTimer();
  gameStartTime = questionStartTime = Date.now();
}

function resetGameState() {
  current = 0; score = 0; answered = false;
  answerLog.length = 0; answers_arr.fill(null);
  timerLeft = TIMER_MAX; clearInterval(timerInterval);
}

/* ==================================================
   TIMER
   ================================================== */
function startTimer() {
  clearInterval(timerInterval);
  timerLeft = TIMER_MAX;
  updateTimerUI(timerLeft);
  timerInterval = setInterval(() => {
    timerLeft--;
    updateTimerUI(timerLeft);
    if (timerLeft <= 0) { clearInterval(timerInterval); timeOut(); }
  }, 1000);
}

function updateTimerUI(s) {
  const circle = document.getElementById('timer-circle');
  const text   = document.getElementById('timer-text');
  const ring   = document.getElementById('timer-ring');
  if (!circle) return;
  circle.style.strokeDasharray  = CIRCUMFERENCE;
  circle.style.strokeDashoffset = CIRCUMFERENCE * (1 - s / TIMER_MAX);
  text.textContent = s;
  if (s <= 5) ring.classList.add('urgent');
  else ring.classList.remove('urgent');
}

function timeOut() {
  if (answered) return;
  answered = true;
  const q = activeQuestions[current];
  answerLog.push({ correct: false, timeTaken: TIMER_MAX, userAnswer: 'timeout', questionType: q.type, subject: q.subject });
  answers_arr[current] = false;
  showFeedback('timeout', q);
  lockActions();
  buildProgress();
  updateLiveScore();
}

/* ==================================================
   PROGRESS
   ================================================== */
function buildProgress() {
  const c = document.getElementById('progress-steps');
  c.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const d = document.createElement('div');
    d.className = 'step-dot' + (i === current ? ' active' : '') + (answers_arr[i] === true ? ' correct' : '') + (answers_arr[i] === false ? ' wrong' : '');
    c.appendChild(d);
  }
}

function updateLiveScore() {
  document.getElementById('live-score').textContent = score;
  document.getElementById('live-total').textContent = current + (answered ? 1 : 0);
}

/* ==================================================
   EMAIL RENDERING
   ================================================== */
function renderEmail(q) {
  // Update URL bar
  document.getElementById('wc-url-text').textContent = q.urlBar || 'mail.client.app/inbox';
  document.getElementById('q-indicator').textContent = String(current + 1).padStart(2,'0') + ' / 10';
  document.getElementById('q-num').textContent = current + 1;

  const diffMap = { easy: '<span class="diff-tag diff-easy">● Хялбар</span>', medium: '<span class="diff-tag diff-medium">◆ Дунд</span>', hard: '<span class="diff-tag diff-hard">▲ Хэцүү</span>' };

  // Highlight suspicious parts of email address for phishing
  let addrHTML = q.from.email;
  if (q.type === 'phish') {
    // Highlight domain portion
    const atIdx = q.from.email.indexOf('@');
    if (atIdx >= 0) {
      const user = q.from.email.slice(0, atIdx + 1);
      const domain = q.from.email.slice(atIdx + 1);
      addrHTML = user + `<span class="addr-highlight">${domain}</span>`;
    }
  }

  document.getElementById('email-display').innerHTML = `
    <div class="email-header-bar">
      <div class="email-from-row">
        <div class="email-avatar" style="background:${q.from.color}">
          <div class="avatar-ring"></div>
          ${q.from.initials}
        </div>
        <div class="email-sender-info">
          <div class="sender-name">${q.from.name} ${diffMap[q.difficulty] || ''}</div>
          <div class="sender-addr">&lt;${addrHTML}&gt;</div>
        </div>
        <div class="email-timestamp">Өнөөдөр, 09:41</div>
      </div>
      <div class="email-subject-line">${q.subject}</div>
    </div>
    <div class="email-body-area">
      <div class="email-body-text">
        ${q.body}<br><br>
        <a class="email-cta" style="background:${q.linkColor};color:#fff" onclick="return false">${q.link}</a>
      </div>
    </div>
  `;
}

/* ==================================================
   ANSWER
   ================================================== */
function answer(choice) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);
  const q = activeQuestions[current];
  const correct = choice === q.type;
  const timeTaken = TIMER_MAX - timerLeft;
  if (correct) score++;
  answers_arr[current] = correct;
  answerLog.push({ correct, timeTaken, userAnswer: choice, questionType: q.type, subject: q.subject });
  showFeedback(correct ? 'correct' : 'wrong', q, timeTaken);
  lockActions();
  buildProgress();
  updateLiveScore();
}

function showFeedback(type, q, timeTaken) {
  const fb = document.getElementById('feedback-box');
  const titles = {
    correct: `✅ Зөв! — ${q.type === 'phish' ? '🎣 Фишинг имэйл' : '✉️ Жинхэнэ имэйл'}`,
    wrong:   `❌ Буруу! — ${q.type === 'phish' ? '🎣 Энэ нь Фишинг имэйл байсан' : '✉️ Энэ нь Жинхэнэ имэйл байсан'}`,
    timeout: `⏰ Хугацаа дууслаа! — ${q.type === 'phish' ? '🎣 Фишинг имэйл байлаа' : '✉️ Жинхэнэ имэйл байлаа'}`
  };
  const timeStr = timeTaken !== undefined ? `<span style="font-size:.72rem;opacity:.6;margin-left:auto;font-family:'JetBrains Mono',monospace">${timeTaken}с</span>` : '';
  fb.className = `feedback-panel ${type}`;
  fb.innerHTML = `
    <div class="fb-title">${titles[type]}${timeStr}</div>
    <div class="fb-desc">${q.hint}</div>
  `;
  fb.style.display = 'block';
  const btnNext = document.getElementById('btn-next');
  btnNext.style.display = 'block';
  btnNext.textContent = current < 9 ? 'Дараагийн асуулт →' : 'Үр дүн харах →';
}

function lockActions() {
  const row = document.getElementById('action-row');
  row.style.opacity = '.35';
  row.style.pointerEvents = 'none';
}

/* ==================================================
   NEXT QUESTION
   ================================================== */
function nextQuestion() {
  if (current < 9) {
    current++; answered = false;
    document.getElementById('feedback-box').style.display = 'none';
    document.getElementById('btn-next').style.display = 'none';
    const row = document.getElementById('action-row');
    row.style.opacity = '1'; row.style.pointerEvents = 'auto';
    renderEmail(activeQuestions[current]);
    buildProgress();
    questionStartTime = Date.now();
    startTimer();
  } else {
    finishGame();
  }
}

/* ==================================================
   FINISH GAME
   ================================================== */
async function finishGame() {
  clearInterval(timerInterval);
  const totalTime = Math.round((Date.now() - gameStartTime) / 1000);
  saveToLeaderboard(username, score, totalTime);
  showScreen('results-screen');
  renderResults(totalTime);
}

function renderResults(totalTime) {
  // Score ring animation
  const circ = 2 * Math.PI * 66;
  const fg = document.getElementById('orbit-fg');
  fg.style.strokeDasharray = circ;
  fg.style.strokeDashoffset = circ;
  setTimeout(() => {
    fg.style.strokeDashoffset = circ * (1 - score / 10);
  }, 200);

  // Animate score counter
  let n = 0;
  const el = document.getElementById('score-display');
  const interval = setInterval(() => {
    n++;
    el.textContent = n;
    if (n >= score) clearInterval(interval);
  }, 120);

  const msgs = {
    10: ['🏆 Мэргэжилтний түвшин', 'Бүх сценарийг зөв ангилсан. Танд фишинг илрүүлэх өндөр чадвар байна — судалгааны үр дүнгийн дээд бүлэгт оров.'],
    9:  ['🥇 Дээд чадварын бүлэг', 'Туршилтын 90%+ зөв — танд кибер аюулгүй байдлын мэдлэг хангалттай хөгжсөн байна.'],
    7:  ['🎯 Дунджаас дээгүүр', 'Ихэнх сценарийг зөв таньсан. Зарим нарийн халдлагын шинж тэмдэг дутуу ажиглагдлаа — нэмэлт дадлага шаардлагатай.'],
    5:  ['⚠️ Дундаж чадварын бүлэг', 'Хагас сценарийг зөв ангилав. Фишинг халдлагын шинж тэмдгийг таних чадварыг хөгжүүлэх шаардлагатай байна.'],
    0:  ['🚨 Доод чадварын бүлэг', 'Судалгааны үр дүнгийн доод бүлэгт орлоо. Кибер аюулгүй байдлын мэдлэгийг эрс нэмэгдүүлэх шаардлагатай.']
  };
  const [title, sub] = score >= 10 ? msgs[10] : score >= 9 ? msgs[9] : score >= 7 ? msgs[7] : score >= 5 ? msgs[5] : msgs[0];
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-sub').textContent = sub;
  document.getElementById('result-username').textContent = username;
  document.getElementById('result-time').textContent = totalTime;

  const phishCaught = answerLog.filter(a => a.questionType === 'phish' && a.correct).length;
  const avgTime = Math.round(answerLog.reduce((s, a) => s + a.timeTaken, 0) / answerLog.length);
  document.getElementById('stat-correct').textContent = score;
  document.getElementById('stat-wrong').textContent = 10 - score;
  document.getElementById('stat-phish-caught').textContent = phishCaught;
  document.getElementById('stat-time-avg').textContent = avgTime + 'с';

  // Answer history
  const container = document.getElementById('answer-history');
  container.innerHTML = '';
  answerLog.forEach((log, i) => {
    const row = document.createElement('div');
    row.className = 'answer-row';
    row.style.animationDelay = `${i * 0.04}s`;
    const icon = log.correct ? '✅' : (log.userAnswer === 'timeout' ? '⏰' : '❌');
    const sub = log.subject.replace(/[⚠️📦🚨⭐]/g, '').trim();
    const subShort = sub.length > 38 ? sub.slice(0, 36) + '…' : sub;
    row.innerHTML = `
      <span class="a-num">${String(i+1).padStart(2,'0')}</span>
      <span>${icon}</span>
      <span class="a-subject">${subShort}</span>
      <span class="a-badge ${log.questionType}">${log.questionType === 'phish' ? '🎣 Фишинг' : '✅ Жинхэнэ'}</span>
      <span class="a-time">${log.timeTaken}с</span>
    `;
    container.appendChild(row);
  });
}

/* ==================================================
   LEADERBOARD (localStorage fallback)
   ================================================== */
async function saveToLeaderboard(name, sc, time) {
  if (window.firebaseDB) {
    await window.firebaseDB.saveScore(name, sc, time);
  } else {
    _saveLocal(name, sc, time);
  }
}

async function renderLeaderboard() {
  const list = document.getElementById('leaderboard-list');
  const top3 = document.getElementById('lb-top3');
  const empty = document.getElementById('leaderboard-empty');
  list.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--text-3);font-family:'JetBrains Mono',monospace;font-size:.82rem">⏳ Ачаалж байна...</div>`;
  empty.style.display = 'none';
  top3.innerHTML = '';

  let board = window.firebaseDB ? await window.firebaseDB.getLeaderboard() : _getLocal();
  list.innerHTML = '';

  if (board.length === 0) { empty.style.display = 'block'; return; }

  // Launch confetti for top score
  launchConfetti();

  // Top 3 podium with animations
  const podiumData = [
    { idx: 1, cls: 'silver', crown: '🥈' },
    { idx: 0, cls: 'gold',   crown: '🥇' },
    { idx: 2, cls: 'bronze', crown: '🥉' }
  ];
  podiumData.forEach(p => {
    const e = board[p.idx];
    if (!e) return;
    const pod = document.createElement('div');
    pod.className = `lb-podium ${p.cls}`;
    pod.innerHTML = `
      <div class="p-crown">${p.crown}</div>
      <div class="p-avatar">${e.name[0]?.toUpperCase() || '?'}</div>
      <div class="p-name">${e.name}</div>
      <div class="p-score">${e.score}/10</div>
    `;
    top3.appendChild(pod);
  });

  // Animate score numbers in podium
  top3.querySelectorAll('.p-score').forEach(el => {
    el.style.animation = 'scoreCountUp .5s ease .6s both';
  });

  // Full list rows with stagger animation
  board.forEach((entry, i) => {
    if (i < 3) return;
    const row = document.createElement('div');
    row.className = 'lb-row' + (entry.name === username ? ' me' : '');
    row.style.animationDelay = `${(i-3) * 0.06}s`;
    const rankEmoji = i === 3 ? '4️⃣' : i === 4 ? '5️⃣' : `${i + 1}`;
    row.innerHTML = `
      <span class="lb-rank">${rankEmoji}</span>
      <span class="lb-name">${entry.name}${entry.name === username ? ' <span style="color:var(--cyan);font-size:.7rem">(энэ оролцогч)</span>' : ''}</span>
      <span class="lb-score">${entry.score}/10</span>
      <span class="lb-time">⏱${entry.time}с</span>
      <span class="lb-date">${entry.date}</span>
    `;
    list.appendChild(row);
  });
  if (board.length <= 3) {
    list.innerHTML = '<div style="padding:.5rem 1.25rem 1rem;text-align:center;color:var(--text-3);font-size:.8rem;font-family:\'JetBrains Mono\',monospace">// бусад оролцогчдын өгөгдөл байхгүй байна</div>';
  }
}

/* Confetti burst animation */
function launchConfetti() {
  // Remove old confetti
  document.querySelectorAll('.lb-confetti').forEach(c => c.remove());
  const colors = ['#fbbf24', '#06d6f5', '#00e5a0', '#1a6cf6', '#ff3d5a', '#a78bfa'];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div');
    c.className = 'lb-confetti';
    c.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${4 + Math.random() * 8}px;
      height: ${4 + Math.random() * 8}px;
      border-radius: ${Math.random() > .5 ? '50%' : '2px'};
      animation-duration: ${1.5 + Math.random() * 2.5}s;
      animation-delay: ${Math.random() * .8}s;
      opacity: 1;
    `;
    document.body.appendChild(c);
    c.addEventListener('animationend', () => c.remove());
  }
}

async function clearLeaderboard() {
  if (!confirm('Бүх судалгааны өгөгдлийг устгах уу?')) return;
  if (window.firebaseDB) await window.firebaseDB.clearAll();
  else localStorage.removeItem('phishing_quiz_leaderboard');
  renderLeaderboard();
}

function _saveLocal(name, sc, time) {
  const board = _getLocal();
  const idx = board.findIndex(e => e.name === name);
  const entry = { name, score: sc, time, date: new Date().toLocaleDateString('mn-MN') };
  if (idx >= 0) {
    if (sc > board[idx].score || (sc === board[idx].score && time < board[idx].time)) board[idx] = entry;
  } else {
    board.push(entry);
  }
  board.sort((a, b) => b.score - a.score || a.time - b.time);
  localStorage.setItem('phishing_quiz_leaderboard', JSON.stringify(board.slice(0, 20)));
}

function _getLocal() {
  try { return JSON.parse(localStorage.getItem('phishing_quiz_leaderboard')) || []; }
  catch { return []; }
}

/* ==================================================
   RESTART
   ================================================== */
function restartSameUser() {
  answers_arr.fill(null);
  resetGameState();
  showScreen('quiz-screen');
  document.getElementById('display-username').textContent = username;
  document.getElementById('feedback-box').style.display = 'none';
  document.getElementById('btn-next').style.display = 'none';
  const row = document.getElementById('action-row');
  row.style.opacity = '1'; row.style.pointerEvents = 'auto';
  renderEmail(activeQuestions[0]);
  buildProgress();
  startTimer();
  gameStartTime = questionStartTime = Date.now();
}

/* ==================================================
   ANALYTICS DASHBOARD
   ================================================== */
function showDashboard() {
  showScreen('dashboard-screen');
  renderDashboard();
}

function renderDashboard() {
  const phishQs  = answerLog.filter(a => a.questionType === 'phish');
  const legitQs  = answerLog.filter(a => a.questionType === 'legit');
  const correct  = answerLog.filter(a => a.correct).length;
  const phishOk  = phishQs.filter(a => a.correct).length;
  const legitOk  = legitQs.filter(a => a.correct).length;
  const avgTime  = (answerLog.reduce((s,a)=>s+a.timeTaken,0)/answerLog.length).toFixed(1);
  const accuracy = ((correct/10)*100).toFixed(0);

  // KPI row
  const kpi = document.getElementById('dash-kpi');
  kpi.innerHTML = [
    { num: score+'/10',  label: '🎯 Нийт оноо',         color: 'var(--cyan)' },
    { num: accuracy+'%', label: '✅ Нийт нарийвчлал',    color: 'var(--green)' },
    { num: avgTime+'с',  label: '⚡ Дундаж хугацаа',     color: 'var(--yellow)' },
    { num: phishOk+'/'+phishQs.length, label: '🎣 Фишинг таньсан', color: 'var(--red)' },
    { num: legitOk+'/'+legitQs.length, label: '✉️ Жинхэнэ таньсан', color: 'var(--blue-2)' },
  ].map(k=>`<div class="kpi-card"><div class="kpi-num" style="color:${k.color}">${k.num}</div><div class="kpi-label">${k.label}</div></div>`).join('');

  // Type bar chart
  const typeChart = document.getElementById('dash-type-chart');
  const phishPct = phishQs.length ? Math.round(phishOk/phishQs.length*100) : 0;
  const legitPct = legitQs.length ? Math.round(legitOk/legitQs.length*100) : 0;
  typeChart.innerHTML = [
    { label:'🎣 Фишинг', pct:phishPct, color:'var(--red)', val:phishOk+'/'+phishQs.length },
    { label:'✅ Жинхэнэ', pct:legitPct, color:'var(--green)', val:legitOk+'/'+legitQs.length },
  ].map(b=>`<div class="bar-row">
    <span class="bar-label">${b.label}</span>
    <div class="bar-track"><div class="bar-fill" style="background:${b.color}" data-w="${b.pct}"></div></div>
    <span class="bar-val">${b.val}</span>
  </div>`).join('');

  // Difficulty bar chart
  const diffChart = document.getElementById('dash-diff-chart');
  const diffs = { easy:'● Хялбар', medium:'◆ Дунд', hard:'▲ Хэцүү' };
  const diffColors = { easy:'var(--green)', medium:'var(--yellow)', hard:'var(--red)' };
  diffChart.innerHTML = Object.entries(diffs).map(([d, label])=>{
    const qs = answerLog.filter((_,i)=> activeQuestions[i]?.difficulty === d);
    const ok = qs.filter(a=>a.correct).length;
    const pct = qs.length ? Math.round(ok/qs.length*100) : 0;
    return `<div class="bar-row">
      <span class="bar-label" style="color:${diffColors[d]}">${label}</span>
      <div class="bar-track"><div class="bar-fill" style="background:${diffColors[d]}" data-w="${pct}"></div></div>
      <span class="bar-val">${ok}/${qs.length}</span>
    </div>`;
  }).join('');

  // Donut chart
  const circumf = 2 * Math.PI * 38;
  const phishTotal = phishQs.length, legitTotal = legitQs.length;
  const phishArc = circumf * (phishTotal/10);
  const legitArc = circumf * (legitTotal/10);
  // Correct within phish
  const phishCorrectArc = circumf * (phishOk/10);
  document.getElementById('donut-phish').setAttribute('stroke-dasharray', phishCorrectArc + ' ' + (circumf - phishCorrectArc));
  document.getElementById('donut-legit').setAttribute('stroke-dasharray', legitOk/10*circumf + ' ' + (circumf - legitOk/10*circumf));
  // offset so they don't overlap
  const offset = circumf * 0.25;
  document.getElementById('donut-phish').style.strokeDashoffset = offset;
  document.getElementById('donut-legit').style.strokeDashoffset = offset - phishCorrectArc;

  document.getElementById('dash-donut-legend').innerHTML = `
    <div class="donut-legend-item"><div class="donut-dot" style="background:var(--red)"></div>Фишинг зөв: ${phishOk}/${phishQs.length}</div>
    <div class="donut-legend-item"><div class="donut-dot" style="background:var(--green)"></div>Жинхэнэ зөв: ${legitOk}/${legitQs.length}</div>
    <div class="donut-legend-item"><div class="donut-dot" style="background:var(--surface-3)"></div>Буруу: ${10-correct}/10</div>
  `;

  // Time chart
  const timeChart = document.getElementById('dash-time-chart');
  const maxTime = Math.max(...answerLog.map(a=>a.timeTaken), 1);
  timeChart.innerHTML = answerLog.map((a,i)=>{
    const h = Math.round((a.timeTaken/maxTime)*76);
    const cls = a.correct ? '' : 'wrong-bar';
    return `<div class="time-bar-wrap">
      <div class="time-bar ${cls}" style="height:${h}px" title="${a.timeTaken}с"></div>
      <div class="time-bar-label">${i+1}</div>
    </div>`;
  }).join('');

  // Score analysis text
  const pct = score/10*100;
  let band='', rec='';
  if(pct>=90){band='Мэргэжилтний түвшин';rec='Кибер аюулгүй байдлын мэдлэг онцгой өндөр. Судалгааны дээд бүлэгт орлоо.';}
  else if(pct>=70){band='Дунджаас дээгүүр';rec='Ихэнх сценарийг зөв таньсан. Хэцүү буюу дунд хүндрэлийн асуултад анхаарна уу.';}
  else if(pct>=50){band='Дундаж түвшин';rec='Зарим фишинг тактик танийг төөрөгдүүлсэн. URL шалгах, яаралтай хэлийг таньж сурах шаардлагатай.';}
  else{band='Доод бүлэг';rec='Кибер аюулгүй байдлын мэдлэг дутмаг байна. Судалгааны онолын хэсгийг уншихыг зөвлөж байна.';}
  document.getElementById('dash-score-analysis').innerHTML = `
    <div style="font-weight:700;color:var(--white);margin-bottom:.5rem">${score}/10 · ${pct}%</div>
    <div style="color:var(--cyan);font-weight:600;margin-bottom:.4rem">${band}</div>
    <div style="color:var(--text-3);font-size:.78rem">${rec}</div>
    <div style="margin-top:.75rem;padding:.65rem;background:var(--surface-2);border-radius:8px;font-size:.75rem;font-family:'JetBrains Mono',monospace;color:var(--text-3)">
      Насны бүлэг: <strong style="color:var(--text-2)">${selectedAge}</strong> &nbsp;|&nbsp;
      Нийт хугацаа: <strong style="color:var(--text-2)">${answerLog.reduce((s,a)=>s+a.timeTaken,0)}с</strong>
    </div>
  `;

  // Deep analysis per question
  const deep = document.getElementById('dash-deep-analysis');
  deep.innerHTML = answerLog.map((a,i)=>{
    const q = activeQuestions[i];
    const icon = a.correct ? '✅' : (a.userAnswer==='timeout' ? '⏰' : '❌');
    const cls = a.correct ? 'analysis-correct' : 'analysis-wrong';
    const timingTag = a.timeTaken >= 15 ? '<span class="analysis-tag slow">⏱ Удаан</span>'
                    : a.timeTaken <= 5  ? '<span class="analysis-tag fast">⚡ Хурдан</span>' : '';
    const typeTag = a.correct
      ? `<span class="analysis-tag ${a.questionType==='phish'?'caught':'fast'}">${a.questionType==='phish'?'🎣 Фишинг тань':'✅ Жинхэнэ тань'}</span>`
      : `<span class="analysis-tag missed">${a.questionType==='phish'?'❌ Фишинг алдсан':'❌ Хуурагдсан'}</span>`;
    const subShort = (q?.subject||'').replace(/[⚠️📦🚨⭐📋]/g,'').trim().slice(0,48);
    return `<div class="analysis-item ${cls}">
      <span style="font-size:1rem">${icon}</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--text-3)">${String(i+1).padStart(2,'0')}</span>
      <div>
        <div style="color:var(--text-1);font-weight:600">${subShort}</div>
        <div class="analysis-detail">${q?.hint||''}</div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.3rem">${typeTag}${timingTag}</div>
      </div>
    </div>`;
  }).join('');

  // Animate bars after render
  setTimeout(()=>{
    document.querySelectorAll('.bar-fill[data-w]').forEach(el=>{
      el.style.width = el.dataset.w + '%';
    });
  }, 100);
}

/* ==================================================
   CSV EXPORT
   ================================================== */
function exportCSV() {
  const headers = ['Асуулт №','Гарчиг','Төрөл','Хариулт','Зөв эсэх','Хугацаа (с)','Насны бүлэг','Хэрэглэгч','Огноо'];
  const rows = answerLog.map((a,i)=>{
    const q = activeQuestions[i];
    const sub = (q?.subject||'').replace(/[⚠️📦🚨⭐📋🎮🚨⭐]/g,'').trim().replace(/,/g,' ');
    return [
      i+1,
      '"'+sub+'"',
      a.questionType==='phish'?'Фишинг':'Жинхэнэ',
      a.userAnswer==='timeout'?'Хугацаа дууссан':a.userAnswer==='phish'?'Фишинг':'Жинхэнэ',
      a.correct?'Зөв':'Буруу',
      a.timeTaken,
      selectedAge,
      username,
      new Date().toLocaleDateString('mn-MN')
    ].join(',');
  });
  const summary = [
    '',
    '"--- НИЙТ ДҮН ---"',
    '"Нийт оноо: '+score+'/10"',
    '"Нарийвчлал: '+(score/10*100).toFixed(0)+'%"',
    '"Дундаж хугацаа: '+(answerLog.reduce((s,a)=>s+a.timeTaken,0)/answerLog.length).toFixed(1)+'с"',
    '"Насны бүлэг: '+selectedAge+'"',
    '"ШУТИС Дипломын ажил 2026"',
  ];
  const csv = '\uFEFF' + [headers.join(','), ...rows, ...summary].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `phishguard_${username}_${Date.now()}.csv`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

/* ==================================================
   GUIDE MODAL
   ================================================== */
function openGuideModal() {
  document.getElementById('guide-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeGuideModal() {
  document.getElementById('guide-modal').classList.remove('open');
  document.body.style.overflow = '';
}
function closeGuideModalOutside(e) {
  if (e.target === document.getElementById('guide-modal')) closeGuideModal();
}
function switchGuideTab(tab) {
  document.querySelectorAll('.guide-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.guide-tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('guide-tab-' + tab).classList.add('active');
  event.currentTarget.classList.add('active');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeGuideModal(); });
