// Configuración de Firebase (Consola Firebase → Configuración del proyecto → Tus apps → App web).
// Estos valores NO son secretos: la seguridad la dan las reglas de Firestore (firestore.rules).
export const firebaseConfig = {
  apiKey: "COMPLETAR_API_KEY",
  authDomain: "COMPLETAR.firebaseapp.com",
  projectId: "COMPLETAR",
  storageBucket: "COMPLETAR.appspot.com",
  messagingSenderId: "COMPLETAR",
  appId: "COMPLETAR"
};

// Prefijo de las colecciones en Firestore. Quedan así:
//   montaje_parque/config      → turbinas, circuitos, posiciones, líneas
//   montaje_turbinas/{id}      → fechas de inicio/fin de cada pieza
//   montaje_alarmas/{id}       → alarmas y tiempo perdido
// Cambialo si querés tener otro parque separado en el mismo proyecto (ej. "ola2_").
export const PREFIX = "montaje_";
