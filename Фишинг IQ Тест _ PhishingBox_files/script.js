/* ============================================
   ФИШИНГ IQ ТЕСТ — SCRIPT.JS
   Шинэ функцүүд:
   - Хэрэглэгчийн нэр оруулах
   - 20 секундын таймер (дугуй)
   - Leaderboard (localStorage)
   - Дэлгэрэнгүй үр дүн
   ============================================ */


/* ================================================
   1. АСУУЛТЫН МЭДЭЭЛЭЛ
   ================================================ */
const questions = [
  {
    type: 'phish',
    from: { name: 'PayPal Security', email: 'security@paypa1-verify.com', color: '#003087' },
    subject: '⚠️ Таны акаунт хязгаарлагдсан байна!',
    body: `Таны PayPal акаунт сэжигтэй үйл ажиллагааны улмаас <strong>түр хязгаарлагдсан</strong> байна.<br><br>
    Акаунтаа бүрэн сэргээхийн тулд мэдээллээ яаралтай баталгаажуулна уу.<br><br>
    <strong>24 цагийн</strong> дотор баталгаажуулаагүй тохиолдолд акаунт байнга хаагдах болно.`,
    link: 'Акаунтаа Одоо Баталгаажуулах',
    hint: 'Илгээгчийн имэйлийг анхаарч үз: "paypa1-verify.com" — "l" үсгийн оронд "1" тоо ашигласан. Яаралтай хэл болон аюул заналхийлэх нь сонгодог фишинг арга.'
  },
  {
    type: 'legit',
    from: { name: 'GitHub', email: 'noreply@github.com', color: '#24292e' },
    subject: 'Таны pull request нэгтгэгдлээ',
    body: `Сайн байна уу,<br><br>
    Таны pull request <strong>#1247 - "Fix login button alignment"</strong> <strong>@devlead</strong> хэрэглэгч <em>main</em> branch руу нэгтгэлээ.<br><br>
    CI pipeline амжилттай дууслаа. Таны өөрчлөлт одоо идэвхтэй байна.`,
    link: 'Pull Request Харах',
    hint: 'Энэ бол GitHub-ийн жинхэнэ мэдэгдэл. Домэйн нь github.com, агуулга тодорхой техникийн шинжтэй бөгөөд яаралтай байдал болон аюул заналхийлэл огт байхгүй.'
  },
  {
    type: 'phish',
    from: { name: 'Apple ID Support', email: 'appleid@apple-id-secure.net', color: '#555' },
    subject: 'Таны Apple ID ашиглагдлаа',
    body: `Таны Apple ID танигдаагүй төхөөрөмжөөс нэвтэрсэн байна.<br><br>
    Төхөөрөмж: <strong>Windows PC — Москва, Орос</strong><br>
    Цаг: Өнөөдөр 03:47<br><br>
    Хэрэв энэ та биш бол таны акаунт аюулд орсон байж болзошгүй. Доорх товчийг яаралтай дарна уу.`,
    link: 'Apple ID-гаа Хамгаалах',
    hint: '"apple-id-secure.net" домэйн нь Apple (apple.com)-ийн домэйн БИШ. Зөвшөөрөлгүй нэвтрэлтийн талаар айлган сүрдүүлэх нь нийтлэг фишинг арга.'
  },
  {
    type: 'legit',
    from: { name: 'Google', email: 'no-reply@accounts.google.com', color: '#4285F4' },
    subject: 'Mac дээрх Chrome-д шинэ нэвтрэлт',
    body: `Таны Google акаунтад шинэ нэвтрэлт илэрлээ.<br><br>
    <strong>Даваа гараг, 3-р сарын 29 · 09:15</strong><br>
    macOS дээрх Chrome · Улаанбаатар, Монгол<br><br>
    Хэрэв энэ та бол юу ч хийх шаардлагагүй. Үгүй бол акаунтынхаа үйл ажиллагааг шалгана уу.`,
    link: 'Үйл Ажиллагаа Шалгах',
    hint: 'Google-ийн жинхэнэ аюулгүй байдлын имэйлүүд @accounts.google.com-аас ирдэг — аймшигтай хэл болон хиймэл яаралтай байдал огт байхгүй.'
  },
  {
    type: 'phish',
    from: { name: 'Amazon Order', email: 'orders@amazon-delivery-update.co', color: '#FF9900' },
    subject: 'Таны багц хүргэгдэх боломжгүй байна 📦',
    body: `Таны захиалгыг <strong>бүрэн бус хаяг</strong>ийн улмаас хүргэх боломжгүй байна.<br><br>
    Таны захиалга #302-8827463-9912847 манай агуулахад хадгалагдаж байна.<br><br>
    Хүргэлтийг дахин товлохын тулд хаягаа шинэчилж <strong>$1.99 дахин хүргэлтийн төлбөр</strong> төлнө үү.`,
    link: 'Хаяг Шинэчлэх & Төлөх',
    hint: 'Amazon хэзээ ч "amazon-delivery-update.co" гэх домэйн ашигладаггүй. Дахин хүргэлтэд мөнгө нэхэх нь томоохон анхааруулга — Amazon энийг зөвхөн албан ёсны аппаараа шийддэг.'
  },
  {
    type: 'legit',
    from: { name: 'Slack', email: 'feedback@slack.com', color: '#4A154B' },
    subject: 'Slack дээр Acme Corp-д урьсан байна',
    body: `<strong>Жон Смит</strong> танийг Slack дээрх <strong>Acme Corp</strong> ажлын орон зайд урьж байна.<br><br>
    Урилгыг хүлээн авч профайлаа тохируулснаар эхлээрэй. Та багтайгаа хаанаас ч хамтран ажиллах боломжтой.`,
    link: 'Ажлын Орон Зайд Нэгдэх',
    hint: 'Энэ бол албан ёсны feedback@slack.com хаягаас ирсэн стандарт Slack урилга. Яаралтай байдал, аюул заналхийлэл байхгүй — зүгээр л энгийн багийн урилга.'
  },
  {
    type: 'phish',
    from: { name: 'IT Department', email: 'it-support@company-helpdesk.xyz', color: '#666' },
    subject: 'ЯАРАЛТАЙ: Нууц үг 1 цагийн дотор дуусна',
    body: `<strong>ЯАРАЛТАЙ ҮЙЛДЭЛ ШААРДЛАГАТАЙ</strong><br><br>
    Таны сүлжээний нууц үг <strong>60 минутын</strong> дотор дуусна. Компанийн бүх системд нэвтрэх эрхээ алдахгүйн тулд нууц үгээ яаралтай сэлбэнэ үү.<br><br>
    Энэ бол таны сүүлчийн сануулга. Доорх товчийг дарж одоо сэлбэнэ үү.`,
    link: 'Нууц Үг Сэлбэх',
    hint: 'IT хэлтэс гадны ".xyz" домэйн биш, албан ёсны компанийн домэйн ашигладаг. "60 минут!" гэх экстрем яаралтай байдал нь хүнийг сандруулж залилах арга техник.'
  },
  {
    type: 'legit',
    from: { name: 'Netflix', email: 'info@mailer.netflix.com', color: '#E50914' },
    subject: 'Netflix дээрх шинэ зүйлс: Сарын санал болгосон кинонууд',
    body: `Сайн байна уу,<br><br>
    Таны үзсэн зүйлд үндэслэн энэ сарын шинэ нэмэлтүүдийг танд таалагдана гэж бодож байна:<br><br>
    🎬 <strong>Цувралын санал 1</strong><br>
    🎬 <strong>Цувралын санал 2</strong><br>
    🎬 <strong>Баримтат кино</strong><br><br>
    Сайхан үзээрэй!`,
    link: 'Одоо Үзэх',
    hint: 'Netflix маркетингийн имэйлдээ mailer.netflix.com ашигладаг. Яаралтай байдал, хувийн мэдээлэл нэхэх, аюул заналхийлэл огт байхгүй — энгийн зөвлөмжийн имэйл.'
  },
  {
    type: 'phish',
    from: { name: 'Bank of America', email: 'alert@bofa-secure-notification.com', color: '#e31837' },
    subject: 'Таны акаунтаас сэжигтэй гүйлгээ илэрлээ',
    body: `Таны Bank of America акаунтаас <strong>зөвшөөрөлгүй $847.00 гүйлгээ</strong> илэрлээ.<br><br>
    Энэ төлбөрийг маргаан болгож акаунтаа хамгаалахын тулд онлайн банкны нэвтрэх мэдээллээ оруулж өгнө үү.<br><br>
    <strong>2 цагийн дотор арга хэмжээ аваагүй бол таны акаунт хөлдөөгдөх болно.</strong>`,
    link: 'Хэрэглэгчийн Мэдээлэл Баталгаажуулах',
    hint: 'Жинхэнэ банкнууд хэзээ ч имэйлээр нэвтрэх мэдээлэл асуудаггүй. "bofa-secure-notification.com" домэйн нь Bank of America (bankofamerica.com) БИШ. 2 цагийн хугацаа хиймэл дарамт.'
  },
  {
    type: 'legit',
    from: { name: 'Dropbox', email: 'no-reply@dropbox.com', color: '#0061FF' },
    subject: 'Сара танд хавтас хуваалцлаа',
    body: `<strong>Сара Жонсон</strong> танд Dropbox дээр <strong>"Q1 2026 Reports"</strong> хавтсыг хуваалцлаа.<br><br>
    Та файлуудыг хэдийд ч харж, татаж авах боломжтой. Хавтас нь нийт 42 MB-ийн 8 файл агуулж байна.`,
    link: 'Хавтас Нээх',
    hint: 'Энэ бол албан ёсны no-reply@dropbox.com хаягаас ирсэн жинхэнэ Dropbox мэдэгдэл. Тодорхой, аюул заналхийлэлгүй хамтран ажиллах энгийн мэдэгдэл.'
  }
];


/* ================================================
   2. ТОГЛООМЫН ТӨЛӨВийн ХУВЬСАГЧИД
   ================================================ */
let username   = '';       // Тоглогчийн нэр
let current    = 0;        // Одоогийн асуулт (0-9)
let score      = 0;        // Нийт оноо
let answered   = false;    // Одоогийн асуултад хариулсан эсэх
let prevScreen = 'login-screen'; // Буцах дэлгэц

// Тус бүр асуултын дэлгэрэнгүй бүртгэл
// { correct, timeTaken, userAnswer, questionType }
const answerLog = [];

// Таймер
const TIMER_MAX  = 20;     // Тус бүр асуулт 20 секунд
let timerLeft    = TIMER_MAX;
let timerInterval = null;

// Нийт тоглоомын хугацаа
let gameStartTime = 0;
let questionStartTime = 0;


/* ================================================
   3. ДЭЛГЭЦ УДИРДЛАГА
   ================================================ */

/**
 * showScreen(id) — зорилтот дэлгэцийг харуулна
 * Бусад дэлгэцүүдийг нуугаад зорилтот дэлгэцийг
 * .active классаар харуулна
 */
function showScreen(id) {
  prevScreen = document.querySelector('.screen.active')?.id || 'login-screen';
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  // Leaderboard дэлгэц рүү шилжихэд шинэчилнэ
  if (id === 'leaderboard-screen') renderLeaderboard();
}

/** Өмнөх дэлгэц рүү буцах */
function goBack() {
  showScreen(prevScreen);
}


/* ================================================
   4. НЭВТРЭХ / ТОГЛООМ ЭХЛЭХ
   ================================================ */

/**
 * startQuiz() — нэрийг шалгаад тоглоом эхлүүлнэ
 */
function startQuiz() {
  const input = document.getElementById('username-input').value.trim();
  const errorEl = document.getElementById('login-error');

  // Нэр хоосон бол алдаа харуулна
  if (!input) {
    errorEl.style.display = 'block';
    document.getElementById('username-input').focus();
    return;
  }

  errorEl.style.display = 'none';
  username = input;

  // Тоглоомын төлөвийг reset хийнэ
  resetGameState();

  // Quiz дэлгэц рүү шилжинэ
  document.getElementById('display-username').textContent = username;
  showScreen('quiz-screen');

  // Эхний асуулт
  renderEmail(questions[0]);
  buildProgress();
  startTimer();

  gameStartTime    = Date.now();
  questionStartTime = Date.now();
}

/**
 * Тоглоомын бүх төлөвийг шинэчлэнэ
 */
function resetGameState() {
  current   = 0;
  score     = 0;
  answered  = false;
  answerLog.length = 0;
  timerLeft = TIMER_MAX;
  clearInterval(timerInterval);
}


/* ================================================
   5. ТАЙМЕР
   ================================================ */
const CIRCUMFERENCE = 2 * Math.PI * 18; // r=18 → ≈ 113

/**
 * startTimer() — 20 секундын countdown эхлүүлнэ
 */
function startTimer() {
  clearInterval(timerInterval);
  timerLeft = TIMER_MAX;
  updateTimerUI(timerLeft);

  timerInterval = setInterval(() => {
    timerLeft--;
    updateTimerUI(timerLeft);

    if (timerLeft <= 0) {
      clearInterval(timerInterval);
      // Хугацаа дууссан — автоматаар буруу хариулт
      timeOut();
    }
  }, 1000);
}

/**
 * updateTimerUI(seconds) — таймерын харагдацыг шинэчлэнэ
 */
function updateTimerUI(seconds) {
  const circle = document.getElementById('timer-circle');
  const text   = document.getElementById('timer-text');
  const ring   = document.querySelector('.timer-ring');

  if (!circle || !text) return;

  // Дугуй хэр дүүрэн байхыг тооцоолно
  const progress = seconds / TIMER_MAX;
  const offset   = CIRCUMFERENCE * (1 - progress);

  circle.style.strokeDasharray  = CIRCUMFERENCE;
  circle.style.strokeDashoffset = offset;
  text.textContent = seconds;

  // 5 секунд хүрэхэд улаан болгоно
  if (seconds <= 5) {
    ring.classList.add('timer-urgent');
  } else {
    ring.classList.remove('timer-urgent');
  }
}

/**
 * timeOut() — хугацаа дуусахад дуудагдана
 */
function timeOut() {
  if (answered) return;
  answered = true;

  const q        = questions[current];
  const timeTaken = TIMER_MAX; // Бүх хугацаа зарцуулсан

  // Бүртгэл — хугацаа дуусчихсан → буруу
  answerLog.push({
    correct:      false,
    timeTaken:    timeTaken,
    userAnswer:   'timeout',
    questionType: q.type,
    subject:      q.subject
  });

  answers_arr[current] = false;

  // Feedback харуулна
  const fb = document.getElementById('feedback-box');
  fb.className = 'feedback timeout';
  fb.innerHTML = `
    <div class="feedback-title">⏰ Хугацаа дууслаа! Энэ бол ${q.type === 'phish' ? 'Фишинг Имэйл' : 'Жинхэнэ Имэйл'}</div>
    <div class="feedback-desc">${q.hint}</div>
  `;
  fb.style.display = 'block';

  // Товчнуудыг идэвхгүй болгоно
  const actionRow = document.getElementById('action-row');
  actionRow.style.opacity       = '0.4';
  actionRow.style.pointerEvents = 'none';

  // Дараагийн товч
  const btnNext = document.getElementById('btn-next');
  btnNext.style.display = 'block';
  btnNext.textContent   = current < 9 ? 'Дараагийн Асуулт →' : 'Үр дүн харах →';

  buildProgress();
  updateLiveScore();
}


/* ================================================
   6. ЯВЦЫН МӨР
   ================================================ */

// Хариултын массив (progress мөрт харуулах)
const answers_arr = new Array(10).fill(null);

/**
 * buildProgress() — 10 цэгийг дүрслэнэ
 */
function buildProgress() {
  const container = document.getElementById('progress-steps');
  container.innerHTML = '';

  for (let i = 0; i < 10; i++) {
    const dot = document.createElement('div');
    let cls = 'step-dot';
    if (i === current)        cls += ' active';
    if (answers_arr[i] === true)  cls += ' correct';
    if (answers_arr[i] === false) cls += ' wrong';
    dot.className = cls;
    container.appendChild(dot);
  }
}

/**
 * updateLiveScore() — дээд талын оноо шинэчлэнэ
 */
function updateLiveScore() {
  document.getElementById('live-score').textContent = score;
  document.getElementById('live-total').textContent = current + (answered ? 1 : 0);
}


/* ================================================
   7. ИМЭЙЛ ДҮРСЛЭХ
   ================================================ */
function renderEmail(q) {
  const initials = q.from.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  document.getElementById('email-display').innerHTML = `
    <div class="email-from">
      <div class="avatar" style="background:${q.from.color}">${initials}</div>
      <div class="email-meta">
        <div class="from-name">${q.from.name}</div>
        <div class="from-addr">&lt;${q.from.email}&gt;</div>
      </div>
      <div class="email-date">Өнөөдөр, 09:41</div>
    </div>
    <div class="email-subject">${q.subject}</div>
    <div class="email-body">
      ${q.body}<br><br>
      <a class="email-link" onclick="return false">${q.link}</a>
    </div>
  `;
}


/* ================================================
   8. ХАРИУЛТ БОЛОВСРУУЛАХ
   ================================================ */

/**
 * answer(choice) — "Фишинг" эсвэл "Жинхэнэ" дарахад дуудагдана
 */
function answer(choice) {
  if (answered) return;
  answered = true;

  clearInterval(timerInterval);

  const q         = questions[current];
  const correct   = (choice === q.type);
  const timeTaken = TIMER_MAX - timerLeft; // Зарцуулсан секунд

  if (correct) score++;
  answers_arr[current] = correct;

  // Бүртгэлд хадгална
  answerLog.push({
    correct,
    timeTaken,
    userAnswer:   choice,
    questionType: q.type,
    subject:      q.subject
  });

  // Feedback
  const fb = document.getElementById('feedback-box');
  fb.className = 'feedback ' + (correct ? 'correct' : 'wrong');
  fb.innerHTML = `
    <div class="feedback-title">
      ${correct ? '✅ Зөв!' : '❌ Буруу!'}
      Энэ бол ${q.type === 'phish' ? 'Фишинг Имэйл' : 'Жинхэнэ Имэйл'}
      <span style="font-size:0.75rem;opacity:0.6;margin-left:auto">${timeTaken}с</span>
    </div>
    <div class="feedback-desc">${q.hint}</div>
  `;
  fb.style.display = 'block';

  // Товчнуудыг идэвхгүй болгоно
  const actionRow = document.getElementById('action-row');
  actionRow.style.opacity       = '0.4';
  actionRow.style.pointerEvents = 'none';

  // Дараагийн товч
  const btnNext = document.getElementById('btn-next');
  btnNext.style.display = 'block';
  btnNext.textContent   = current < 9 ? 'Дараагийн Асуулт →' : 'Үр дүн харах →';

  buildProgress();
  updateLiveScore();
}


/* ================================================
   9. ДАРААГИЙН АСУУЛТ
   ================================================ */
function nextQuestion() {
  if (current < 9) {
    current++;
    answered  = false;

    // UI цэвэрлэнэ
    document.getElementById('feedback-box').style.display = 'none';
    document.getElementById('btn-next').style.display     = 'none';

    const actionRow = document.getElementById('action-row');
    actionRow.style.opacity       = '1';
    actionRow.style.pointerEvents = 'auto';

    document.getElementById('q-num').textContent       = current + 1;
    document.getElementById('q-indicator').textContent = String(current + 1).padStart(2, '0') + ' / 10';

    renderEmail(questions[current]);
    buildProgress();

    // Шинэ таймер эхлүүлнэ
    questionStartTime = Date.now();
    startTimer();

  } else {
    finishGame();
  }
}


/* ================================================
   10. ТОГЛООМ ДУУСГАХ
   ================================================ */
async function finishGame() {
  clearInterval(timerInterval);

  const totalTime = Math.round((Date.now() - gameStartTime) / 1000);

  // Leaderboard-д хадгална
  saveToLeaderboard(username, score, totalTime);

  // Үр дүн дэлгэц
  showScreen('results-screen');
  renderResults(totalTime);
}

/**
 * renderResults(totalTime) — үр дүн дэлгэцийг дүүргэнэ
 */
function renderResults(totalTime) {
  // Оноо дугуй
  document.getElementById('score-display').textContent = score;
  const pct = score / 10;
  document.getElementById('score-ring').style.background =
    `conic-gradient(var(--accent) ${pct * 360}deg, var(--surface2) ${pct * 360}deg)`;

  // Мессеж
  let title, sub;
  if      (score >= 9) { title = '🏆 Аюулгүй байдлын мэргэжилтэн!'; sub = 'Гайхалтай! Та фишинг халдлагыг мэргэжлийн түвшинд илрүүлж чадаж байна.'; }
  else if (score >= 7) { title = '🎯 Сайн мэдлэгтэй';               sub = 'Сайн байна! Та фишинг илрүүлэх чадвар сайтай байна.'; }
  else if (score >= 5) { title = '⚠️ Дэвшил хэрэгтэй';              sub = 'Муу биш, гэхдээ зарим фишинг имэйл таныг төөрөгдүүлсэн байна.'; }
  else                 { title = '🚨 Өндөр эрсдэлтэй';               sub = 'Илүү их дадлага хэрэгтэй — фишинг халдлага таныг хуурах магадлал өндөр байна.'; }

  document.getElementById('result-title').textContent = title;
  document.getElementById('result-sub').textContent   = sub;
  document.getElementById('result-username').textContent = username;
  document.getElementById('result-time').textContent     = totalTime;

  // 4 статистик
  const phishCaught = answerLog.filter(a => a.questionType === 'phish' && a.correct).length;
  const avgTime     = Math.round(answerLog.reduce((s, a) => s + a.timeTaken, 0) / answerLog.length);

  document.getElementById('stat-correct').textContent      = score;
  document.getElementById('stat-wrong').textContent        = 10 - score;
  document.getElementById('stat-phish-caught').textContent = phishCaught;
  document.getElementById('stat-time-avg').textContent     = avgTime + 'с';

  // Дэлгэрэнгүй хариулт түүх
  renderAnswerHistory();
}

/**
 * renderAnswerHistory() — тус бүр асуултын үр дүн жагсаалт
 */
function renderAnswerHistory() {
  const container = document.getElementById('answer-history');
  container.innerHTML = '';

  answerLog.forEach((log, i) => {
    const row = document.createElement('div');
    row.className = 'answer-row';
    row.style.animationDelay = `${i * 0.05}s`;

    const icon    = log.correct    ? '✅' : (log.userAnswer === 'timeout' ? '⏰' : '❌');
    const badgeCls = log.questionType === 'phish' ? 'badge-phish' : 'badge-legit';
    const badgeTxt = log.questionType === 'phish' ? '🎣 Фишинг'   : '✅ Жинхэнэ';

    // Гарчгийг богиносгоно
    const subjectShort = log.subject.length > 40
      ? log.subject.replace(/[⚠️📦]/g, '').trim().slice(0, 38) + '…'
      : log.subject;

    row.innerHTML = `
      <span class="answer-num">${i + 1}</span>
      <span class="answer-icon">${icon}</span>
      <span class="answer-subject">${subjectShort}</span>
      <span class="answer-badge ${badgeCls}">${badgeTxt}</span>
      <span class="answer-time">${log.timeTaken}с</span>
    `;
    container.appendChild(row);
  });
}


/* ================================================
   11. LEADERBOARD — Firebase Firestore
   firebase.js дотроос window.firebaseDB ашиглана.
   Firebase тохиргоогүй үед localStorage-д буцна.
   ================================================ */

/**
 * saveToLeaderboard(name, score, time)
 * Firebase байвал онлайн, үгүй бол localStorage
 */
async function saveToLeaderboard(name, score, time) {
  if (window.firebaseDB) {
    await window.firebaseDB.saveScore(name, score, time);
  } else {
    // Fallback: localStorage
    _saveLocal(name, score, time);
  }
}

/**
 * renderLeaderboard() — Firebase-аас жагсаалт авч дэлгэцэд харуулна
 */
async function renderLeaderboard() {
  const list     = document.getElementById('leaderboard-list');
  const emptyMsg = document.getElementById('leaderboard-empty');

  // Ачаалж байгааг харуулна
  list.innerHTML = `
    <div style="padding:2rem;text-align:center;color:var(--text-muted);font-family:'Space Mono',monospace;font-size:0.85rem">
      ⏳ Ачаалж байна...
    </div>`;
  emptyMsg.style.display = 'none';

  let board = [];
  if (window.firebaseDB) {
    board = await window.firebaseDB.getLeaderboard();
  } else {
    board = _getLocal();
  }

  list.innerHTML = '';

  if (board.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }

  board.forEach((entry, i) => {
    const row = document.createElement('div');
    row.className = 'lb-row' + (entry.name === username ? ' current-user' : '');
    row.style.animationDelay = `${i * 0.04}s`;

    const rankCls   = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'normal';
    const rankEmoji = i === 0 ? '🥇'   : i === 1 ? '🥈'     : i === 2 ? '🥉'     : `${i + 1}`;
    const isMe      = entry.name === username;

    row.innerHTML = `
      <span class="lb-rank ${rankCls}">${rankEmoji}</span>
      <span class="lb-name">${entry.name}${isMe ? ' <span style="color:var(--accent);font-size:0.7rem">(та)</span>' : ''}</span>
      <span class="lb-score">${entry.score}/10</span>
      <span class="lb-time">⏱${entry.time}с</span>
      <span class="lb-date">${entry.date}</span>
    `;
    list.appendChild(row);
  });
}

/**
 * clearLeaderboard() — бүх оноог устгана
 */
async function clearLeaderboard() {
  if (!confirm('Бүх оноог устгах уу?')) return;

  if (window.firebaseDB) {
    await window.firebaseDB.clearAll();
  } else {
    localStorage.removeItem('phishing_quiz_leaderboard');
  }
  renderLeaderboard();
}

/* --- localStorage fallback функцүүд --- */
function _saveLocal(name, score, time) {
  const board = _getLocal();
  const idx   = board.findIndex(e => e.name === name);
  const entry = { name, score, time, date: new Date().toLocaleDateString('mn-MN') };
  if (idx >= 0) {
    if (score > board[idx].score || (score === board[idx].score && time < board[idx].time))
      board[idx] = entry;
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


/* ================================================
   12. ДАХИН ТОГЛОХ
   ================================================ */

/**
 * restartSameUser() — нэр хэвээр хадгалж дахин эхлэнэ
 */
function restartSameUser() {
  // Answers_arr цэвэрлэнэ
  answers_arr.fill(null);
  resetGameState();

  showScreen('quiz-screen');

  document.getElementById('display-username').textContent = username;
  document.getElementById('q-num').textContent            = '1';
  document.getElementById('q-indicator').textContent      = '01 / 10';
  document.getElementById('feedback-box').style.display   = 'none';
  document.getElementById('btn-next').style.display       = 'none';

  const actionRow = document.getElementById('action-row');
  actionRow.style.opacity       = '1';
  actionRow.style.pointerEvents = 'auto';

  renderEmail(questions[0]);
  buildProgress();
  startTimer();

  gameStartTime     = Date.now();
  questionStartTime = Date.now();
}
