/* ============================================
   FIREBASE.JS — Firestore Leaderboard
   
   ⚠️  ЗААВАЛ: Доорх firebaseConfig-ийг
   Firebase Console-оос авсан өөрийнхөөрөө
   солих хэрэгтэй!
   ============================================ */
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
<<<<<<< HEAD
=======
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

>>>>>>> e04bfd9 (Add Firebase Hosting deploy workflow)

/* ================================================
   1. FIREBASE ТОХИРГОО
   Firebase Console → Project Settings → Your apps
   доорх config-ийг энд буулгана уу
   ================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyCH-XwdFRF3nnFA5kHYadYz4O1fvI7iFiE",
  authDomain: "diplom-7ee78.firebaseapp.com",
  projectId: "diplom-7ee78",
  storageBucket: "diplom-7ee78.firebasestorage.app",
  messagingSenderId: "764395799183",
<<<<<<< HEAD
  appId: "1:764395799183:web:8f7fea15fa18a62687a6fa",
  measurementId: "G-GCJ1JGYPXB"
=======
  appId: "1:764395799183:web:b2122d37f4121dff87a6fa",
  measurementId: "G-ZF2TVKPJ43"
>>>>>>> e04bfd9 (Add Firebase Hosting deploy workflow)
};

/* ================================================
   2. FIREBASE ЭХЛҮҮЛЭХ
   ================================================ */
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const analytics = getAnalytics(app);
// Leaderboard collection нэр
const COLLECTION = "leaderboard";


/* ================================================
   3. ОНОО ХАДГАЛАХ
   Тухайн нэртэй тоглогч өмнө нь тоглосон бол
   илүү сайн оноог нь хадгалж, хуучныг устгана
   ================================================ */
async function saveScoreOnline(name, score, time) {
  try {
    // Тухайн нэртэй тоглогч байгаа эсэхийг шалгана
    const existing = await getDocs(
      query(collection(db, COLLECTION), where("name", "==", name))
    );

    if (!existing.empty) {
      const old = existing.docs[0];
      const oldData = old.data();

      // Шинэ оноо илүү сайн бол хуучныг устгаад шинийг нэмнэ
      const isBetter = score > oldData.score ||
        (score === oldData.score && time < oldData.time);

      if (isBetter) {
        await deleteDoc(doc(db, COLLECTION, old.id));
      } else {
        // Хуучин оноо нь сайн байвал шинийг хадгалахгүй
        console.log("Хуучин оноо нь илүү сайн байна, хадгалахгүй.");
        return;
      }
    }

    // Шинэ оноо нэмнэ
    await addDoc(collection(db, COLLECTION), {
      name,
      score,
      time,
      date: new Date().toLocaleDateString("mn-MN"),
      timestamp: Date.now()
    });

    console.log("✅ Оноо амжилттай хадгалагдлаа:", name, score);

  } catch (err) {
    console.error("❌ Firebase хадгалах алдаа:", err);
    // Firebase алдаатай бол localStorage-д хадгална
    saveToLeaderboardLocal(name, score, time);
  }
}


/* ================================================
   4. LEADERBOARD УНШИХ (Top 20)
   ================================================ */
async function getLeaderboardOnline() {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy("score", "desc"),
      orderBy("time", "asc"),
      limit(20)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

  } catch (err) {
    console.error("❌ Firebase унших алдаа:", err);
    // Алдаатай бол localStorage-аас уншина
    return getLeaderboardLocal();
  }
}


/* ================================================
   5. LEADERBOARD ЦЭВЭРЛЭХ
   (Зөвхөн dev/test зориулалттай)
   ================================================ */
async function clearLeaderboardOnline() {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    const deletePromises = snapshot.docs.map(d =>
      deleteDoc(doc(db, COLLECTION, d.id))
    );
    await Promise.all(deletePromises);
    console.log("✅ Leaderboard цэвэрлэгдлээ");
  } catch (err) {
    console.error("❌ Цэвэрлэх алдаа:", err);
  }
}


/* ================================================
   6. FALLBACK — localStorage (offline нөөц)
   Firebase ажиллахгүй үед ашиглана
   ================================================ */
const LS_KEY = "phishing_quiz_leaderboard";

function saveToLeaderboardLocal(name, score, time) {
  const board = getLeaderboardLocal();
  const existing = board.findIndex(e => e.name === name);
  const entry = { name, score, time, date: new Date().toLocaleDateString("mn-MN") };

  if (existing >= 0) {
    const isBetter = score > board[existing].score ||
      (score === board[existing].score && time < board[existing].time);
    if (isBetter) board[existing] = entry;
  } else {
    board.push(entry);
  }

  board.sort((a, b) => b.score - a.score || a.time - b.time);
  localStorage.setItem(LS_KEY, JSON.stringify(board.slice(0, 20)));
}

function getLeaderboardLocal() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch {
    return [];
  }
}


/* ================================================
   7. GLOBAL-Д ГАРГАНА
   script.js дотроос дуудах боломжтой болгоно
   ================================================ */
window.firebaseDB = {
  saveScore:      saveScoreOnline,
  getLeaderboard: getLeaderboardOnline,
  clearAll:       clearLeaderboardOnline
};

console.log("🔥 Firebase холбогдлоо!");
