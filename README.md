# Guess The Geo 🪨

Juego diario de adivinar minerales y rocas a partir de una imagen, inspirado en [guessthe.game](https://guessthe.game/). Cada día hay un objeto distinto (igual para todos), con 6 intentos y pistas que se revelan al fallar.

**🎮 Jugar:** [enlace-a-tu-proyecto.vercel.app](https://)

---

## mxn Español

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
- Estadísticas y racha guardadas en el navegador.
- Compartir resultado.

### Datos
Los datos provienen de **Wikidata** y las imágenes de **Wikimedia Commons**, generados con un script:

```bash
node scripts/generar-minerales.mjs
```

Esto reescribe `src/data/minerals.js`. Los datos son de licencia libre (Wikidata es CC0).

### Desarrollo
```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo
npm run build   # compilar para producción
```

### Tecnologías
React 19 · Vite · Tailwind CSS 4 · Datos de Wikidata/Wikimedia Commons

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
- Stats and streak saved in the browser.
- Share your result.

### Data
Data comes from **Wikidata** and images from **Wikimedia Commons**, generated with a script:

```bash
node scripts/generar-minerales.mjs
```

This rewrites `src/data/minerals.js`. The data is freely licensed (Wikidata is CC0).

### Development
```bash
npm install     # install dependencies
npm run dev     # dev server
npm run build   # production build
```

### Tech stack
React 19 · Vite · Tailwind CSS 4 · Wikidata/Wikimedia Commons data

---

*Los datos y las imágenes pertenecen a sus respectivos autores vía Wikidata y Wikimedia Commons. / Data and images belong to their respective authors via Wikidata and Wikimedia Commons.*