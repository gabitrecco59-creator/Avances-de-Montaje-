// Configuración de Firebase — proyecto "montaje-de-proyecto".
// Estos valores NO son secretos: la seguridad la dan las reglas de Firestore (firestore.rules).
export const firebaseConfig = {
  apiKey: "AIzaSyBD9klyTnmd_JJPZl-3nRb_Bum1vnRY5Ns",
  authDomain: "montaje-de-proyecto.firebaseapp.com",
  projectId: "montaje-de-proyecto",
  storageBucket: "montaje-de-proyecto.firebasestorage.app",
  messagingSenderId: "498421645506",
  appId: "1:498421645506:web:b025e3d7edab37fbb83b5b"
};

// Prefijo de las colecciones en Firestore. Quedan así:
//   montaje_parque/config      → turbinas, circuitos, posiciones, líneas
//   montaje_turbinas/{id}      → fechas de inicio/fin de cada pieza
//   montaje_alarmas/{id}       → alarmas y tiempo perdido
// Cambialo si querés tener otro parque separado en el mismo proyecto (ej. "ola2_").
export const PREFIX = "montaje_";
