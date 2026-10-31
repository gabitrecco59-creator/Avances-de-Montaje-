// Adaptador Firestore para la app de montaje.
// Expone la misma interfaz mínima que usa index.html:
//   db.doc(path).set(obj) / .delete() / .onSnapshot(next, error)
//   db.collection(path).onSnapshot(next, error)
import { firebaseConfig, PREFIX } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  initializeFirestore, getFirestore, persistentLocalCache, persistentMultipleTabManager,
  doc, collection, setDoc, deleteDoc, onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const done = (v) => { try { window.__fbResolve && window.__fbResolve(v); } catch (_) {} };

async function start() {
  if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('COMPLETAR')) {
    console.warn('[montaje] firebase-config.js sin completar: la app funciona en modo local.');
    return done(null);
  }
  const app = initializeApp(firebaseConfig);

  // Caché offline: en el parque se puede trabajar sin señal y sincroniza al volver.
  let fs;
  try {
    fs = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
  } catch (e) {
    console.warn('[montaje] sin caché persistente:', e);
    fs = getFirestore(app);
  }

  // Autenticación anónima (requisito de las reglas de Firestore).
  const auth = getAuth(app);
  await new Promise((resolve) => {
    const off = onAuthStateChanged(auth, (u) => { if (u) { off(); resolve(); } });
    signInAnonymously(auth).catch((e) => { console.error('[montaje] auth anónima falló:', e); resolve(); });
  });

  const seg = (p) => { const s = p.split('/'); s[0] = PREFIX + s[0]; return s; };
  const errCode = (e) => {
    const c = e && e.code;
    if (c === 'permission-denied' || c === 'invalid-argument') return 'invalid_argument';
    if (c === 'resource-exhausted') return 'quota_exceeded';
    if (c === 'unavailable' || c === 'deadline-exceeded') return 'unavailable';
    return c || 'unavailable';
  };
  const wrapErr = (e) => ({ code: errCode(e), message: (e && e.message) || String(e) });
  const snap = (d) => ({ id: d.id, exists: d.exists(), data: () => d.data(), metadata: d.metadata });

  // Con caché offline, setDoc sólo resuelve cuando el servidor confirma.
  // Si no hay señal, el cambio ya quedó guardado localmente: no bloqueamos la app.
  const soft = (pr) => Promise.race([pr.catch((e) => { throw wrapErr(e); }), new Promise((r) => setTimeout(r, 4000))]);

  const api = {
    doc(path) {
      const ref = doc(fs, ...seg(path));
      return {
        set: (o) => soft(setDoc(ref, o)),
        delete: () => soft(deleteDoc(ref)),
        onSnapshot: (next, error) => onSnapshot(ref, { includeMetadataChanges: true }, (s) => next(snap(s)), (e) => error && error(wrapErr(e))),
      };
    },
    collection(path) {
      const ref = collection(fs, ...seg(path));
      return {
        onSnapshot: (next, error) => onSnapshot(ref, { includeMetadataChanges: true },
          (q) => next({ docs: q.docs.map(snap), size: q.size, empty: q.empty, metadata: q.metadata }),
          (e) => error && error(wrapErr(e))),
      };
    },
  };
  done(api);
}

start().catch((e) => { console.error('[montaje] Firebase no disponible:', e); done(null); });
