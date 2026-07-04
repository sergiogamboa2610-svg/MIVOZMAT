# Mi Voz V2 - Amigos de ConstruVilla

Aplicación web/PWA local para comunicación visual infantil, actividades tranquilas y personalización con voces propias.

> Temática original: “Los Amigos de ConstruVilla”. No usa imágenes ni nombres oficiales de personajes comerciales.

## Características

- 4 personajes con personalidad propia:
  - Bruno: perrito constructor tranquilo.
  - Luna: cachorrita cariñosa.
  - Max: camión feliz.
  - Tito: tractor de calma.
- Comunicador visual por categorías.
- Voces del navegador con velocidad y tono ajustables.
- Audios grabados/subidos por personaje, palabra y familiares.
- Sección de familia con fotos y audios personalizados.
- Rutinas visuales: mañana, noche y escuela.
- Zona de calma con respiración guiada.
- Juegos:
  - Colorear.
  - Rompecabezas de 2 o 3 piezas.
  - Asociación simple imagen-palabra.
- Estadísticas locales de palabras usadas.
- Exportar/importar la configuración en JSON.
- PWA básica con manifest y service worker.

## Cómo ejecutar

### Opción simple
Abre `index.html` en Chrome o Edge.

### Mejor opción para modo app/PWA
Desde la carpeta del proyecto:

```bash
npx serve .
```

Luego abre la URL local indicada, por ejemplo:

```text
http://localhost:3000
```

Si el navegador lo permite, aparecerá la opción de instalar la aplicación.

## Cómo hacer las voces más infantiles

En **Ajustes**:

1. Cambia la voz del navegador.
2. Sube audios cortos en “Voces por personaje”.
3. Sube audios específicos para tarjetas o familiares.

Recomendación: grabar frases con voz familiar y expresiva, por ejemplo:

- “Hola campeón”
- “Quiero agua”
- “Muy bien, lo lograste”
- “Estoy aquí contigo”

## Dónde se guarda la información

Todo se guarda localmente en el navegador usando `localStorage`.
No se envía información a internet.

Puedes usar **Exportar datos JSON** para respaldar la configuración.

## Próximas mejoras sugeridas

- Pasarlo a React + TypeScript.
- Agregar grabación directa desde micrófono.
- Agregar perfiles por niño.
- Agregar pictogramas personalizados.
- Agregar sincronización opcional en la nube.
- Empaquetar como app Android con Capacitor.


## Pestaña Videos

La versión 3 agrega una pestaña **Videos** con enfoque similar a YouTube Kids, pero más controlado:

- No incluye buscador libre.
- Solo reproduce videos agregados por mamá/papá.
- Permite enlaces de YouTube normales, enlaces embed o videos locales.
- Usa `youtube-nocookie.com` para incrustar videos de YouTube de forma más limitada.
- Incluye botón para detener video y refuerzo del personaje.

### Recomendación
Usa videos cortos, tranquilos y revisados previamente. Evita dejar enlaces libres o listas automáticas si quieres una experiencia más predecible.
