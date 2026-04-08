/* ============================================
   FIREBASE.JS — Firestore Leaderboard
   ============================================ */

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

/* ================================================
   1. FIREBASE ТОХИРГОО
   ================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyCH-XwdFRF3nnFA5kHYadYz4O1fvI7iFiE",
  authDomain: "diplom-7ee78.firebaseapp.com",
  projectId: "diplom-7ee78",
  storageBucket: "diplom-7ee78.firebasestorage.app",
  messagingSenderId: "764395799183",
  appId: "1:764395799183:web:8f7fea15fa18a62687a6fa",
  measurementId: "G-GCJ1JGYPXB"
};

/* ================================================
   2. FIREBASE ЭХЛҮҮЛЭХ
   ================================================ */
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const COLLECTION = "leaderboard";


/* ================================================
   3. ОНОО ХАДГАЛАХ
   ================================================ */
async function saveScoreOnline(name, score, time) {
  try {
    const existing = await getDocs(
      query(collection(db, COLLECTION), where("name", "==", name))
    );

    if (!existing.empty) {
      const old = existing.docs[0];
      const oldData = old.data();

      const isBetter = score > oldData.score ||
        (score === oldData.score && time < oldData.time);

      if (isBetter) {
        await deleteDoc(doc(db, COLLECTION, old.id));
      } else {
        console.log("Хуучин оноо нь илүү сайн байна, хадгалахгүй.");
        return;
      }
    }

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
    return getLeaderboardLocal();
  }
}


/* ================================================
   5. LEADERBOARD ЦЭВЭРЛЭХ
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
   ================================================ */
window.firebaseDB = {
  saveScore:      saveScoreOnline,
  getLeaderboard: getLeaderboardOnline,
  clearAll:       clearLeaderboardOnline
};

console.log("🔥 Firebase холбогдлоо!");
