# Guess The Geo 🪨

Juego diario de adivinar minerales y rocas a partir de una imagen, inspirado en [guessthe.game](https://guessthe.game/). Cada día hay un objeto distinto (igual para todos), con 6 intentos y pistas que se revelan al fallar.

**🎮 Jugar:** [guess-the-geo.vercel.app](https://guess-the-geo.vercel.app)

### 👤 Cuenta de prueba
Puedes jugar sin registrarte (modo invitado). Si quieres probar las cuentas con sincronización:
- **Usuario / Email:** `demo@guessthegeo.com`
- **Contraseña:** `demo1234`

*(Cuenta de demostración; sus datos pueden cambiar.)*

---

## 🇲🇽 Español

### ¿Cómo se juega?
- Cada día se muestra la imagen de un mineral o roca, muy ampliada.
- Tienes 6 intentos para adivinarlo.
- Con cada fallo, la imagen se aleja y se revela una pista nueva (de la más técnica a la más clara).
- Un intento parcialmente relacionado (misma familia, color, etc.) se marca en amarillo.

### Características
- Objeto del día determinista (mismo para todos, sin repetir dentro del mes).
- Pistas por niveles de dificultad.
- Buscador con autocompletado.
- Se puede jugar días anteriores.
- Cuentas de usuario opcionales con progreso sincronizado.
- Estadísticas y racha (en el navegador o en la nube si inicias sesión).
- Compartir resultado.

### Datos
Los datos provienen de **Wikidata** y las imágenes de **Wikimedia Commons**, generados con un script:

```bash
node scripts/generar-minerales.mjs
```

Los datos son de licencia libre (Wikidata es CC0).

### Arquitectura
- **Frontend:** React + Vite, desplegado en Vercel.
- **Backend:** Node + Express, desplegado en Render.
- **Base de datos:** MongoDB (Atlas en producción, Docker en desarrollo).

### Desarrollo
```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo
npm run build   # compilar para producción
```

### Tecnologías
React 19 · Vite · Tailwind CSS 4 · Node · Express · MongoDB · Datos de Wikidata/Wikimedia Commons

---

## 🇬🇧 English

### How to play
- Each day shows a heavily zoomed-in image of a mineral or rock.
- You have 6 guesses to identify it.
- Each wrong guess zooms the image out and reveals a new hint (from most technical to most obvious).
- A partially related guess (same family, color, etc.) is marked yellow.

### Features
- Deterministic daily object (same for everyone, no repeats within the month).
- Hints grouped by difficulty level.
- Autocomplete search.
- Playable previous days.
- Optional user accounts with synced progress.
- Stats and streak (in the browser, or in the cloud when logged in).
- Share your result.

### Data
Data comes from **Wikidata** and images from **Wikimedia Commons**, generated with a script:

```bash
node scripts/generar-minerales.mjs
```

The data is freely licensed (Wikidata is CC0).

### Architecture
- **Frontend:** React + Vite, deployed on Vercel.
- **Backend:** Node + Express, deployed on Render.
- **Database:** MongoDB (Atlas in production, Docker in development).

### Development
```bash
npm install     # install dependencies
npm run dev     # dev server
npm run build   # production build
```

### Tech stack
React 19 · Vite · Tailwind CSS 4 · Node · Express · MongoDB · Wikidata/Wikimedia Commons data

---

*Los datos y las imágenes pertenecen a sus respectivos autores vía Wikidata y Wikimedia Commons. / Data and images belong to their respective authors via Wikidata and Wikimedia Commons.*