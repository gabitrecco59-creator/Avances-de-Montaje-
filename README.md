# Montaje de aerogeneradores

App web para seguir el montaje de un parque eólico:

- **Mapa** con las turbinas, los circuitos y la SET. Se puede hacer zoom, mover el mapa, bloquear las posiciones y editar el recorrido, grosor y tipo de cada línea de circuito (incluida una línea de alta tensión con torres).
- **Montaje por pieza**: Base, T1–T5, Nacelle, Power train, Radiador, Hub y Palas A/B/C.
  - Un toque registra el inicio del izaje; otro toque registra el fin.
  - Las piezas se montan en orden.
- **Alarmas del supervisor**, con su tiempo perdido.
- **Registro** del avance y bitácora, con exportación a CSV.

Está hecha en HTML/JS sin build. Los datos se guardan en **Firestore** y la página se publica en **Vercel** (o en Firebase Hosting).

```
public/
  index.html          ← la app completa
  db-firebase.js      ← conexión a Firestore (auth anónima + caché offline)
  firebase-config.js  ← COMPLETAR con los datos de tu proyecto Firebase
  manifest.json, icon.svg
firestore.rules       ← reglas de seguridad
firebase.json, .firebaserc
vercel.json
```

Si `firebase-config.js` no está completo, la app funciona en **modo local**: guarda los datos sólo en ese navegador. Sirve para probar.

---

## 1. Firebase

1. Entrá a <https://console.firebase.google.com>. Creá un proyecto o usá uno existente. Como las colecciones llevan el prefijo `montaje_`, no se pisan con las que ya tengas.
2. **Firestore Database**: creá la base en modo producción. Se recomienda la región `southamerica-east1`.
3. **Authentication**: en *Sign-in method*, habilitá **Anónimo**.
4. **Configuración del proyecto**: en *Tus apps*, agregá una **app web**. Copiá el objeto `firebaseConfig` y pegalo en `public/firebase-config.js`.
5. **Reglas**: elegí una de estas dos opciones.
   - Pegá el contenido de `firestore.rules` en *Firestore → Reglas* y publicá.
   - Usá la terminal:
     ```bash
     # Poné el ID de tu proyecto en .firebaserc
     npx firebase-tools login
     npm run deploy:rules
     ```

## 2. GitHub

```bash
cd wtg-montaje
git init
git add .
git commit -m "App de montaje de aerogeneradores"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/wtg-montaje.git
git push -u origin main
```

## 3. Vercel

1. En <https://vercel.com/new>, importá el repo `wtg-montaje`.
2. Configurá el proyecto así:
   - **Framework Preset**: *Other*
   - **Build Command**: vacío
   - **Output Directory**: `public` (ya está en `vercel.json`)
3. Hacé el deploy. Cada `git push` a `main` vuelve a publicar la app solo.
4. Por las dudas, agregá el dominio de Vercel (por ejemplo `wtg-montaje.vercel.app`) en Firebase. Está en *Authentication → Settings → Authorized domains*.

### Alternativa: Firebase Hosting

```bash
npm run deploy:firebase
```

## Probar en la compu

```bash
npm run dev     # abre http://localhost:5173
```

---

## Datos en Firestore

| Ruta | Contenido |
|---|---|
| `montaje_parque/config` | Turbinas (nombre, circuito, x/y), circuitos (nombre, color, grosor, tipo, recorrido), SET y bloqueo |
| `montaje_turbinas/{id}` | `parts.{pieza}.inicio` / `parts.{pieza}.fin` (ISO) |
| `montaje_alarmas/{id}` | turbina, motivo, detalle, supervisor, inicio, fin |

## Funcionamiento sin señal

La app usa la caché offline de Firestore. Si en el parque no hay señal, los registros se guardan en el teléfono y se sincronizan solos al volver la conexión.

## Pendiente / próximos ajustes

- Usuarios con email y roles (supervisor / lectura) para limitar quién puede escribir.
- Coordenadas reales (lat/long) de las WTG.
- Secuencia de montaje configurable.
