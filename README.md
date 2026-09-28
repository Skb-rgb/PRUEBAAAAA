# Portafolio 3D editable para GitHub Pages

Sitio estático de tres pantallas. Incluye el personaje animado `assets/personaje.glb` y cambia el encuadre de la cámara según el scroll.

## Editar los encuadres viendo el resultado

1. Publica los archivos en GitHub Pages y abre la dirección de tu sitio agregando `?editar=1` al final. Ejemplo: `https://usuario.github.io/PORTFOLIO3D/?editar=1`.
2. En el panel de la derecha, selecciona una pantalla y mueve los controles. El cambio se ve en el momento.
3. Pulsa **DESCARGAR CONFIG.JS**. Reemplaza el archivo `config.js` de la raíz del repositorio con el descargado y haz **Commit changes**.
4. Abre la URL normal, sin `?editar=1`, para ver el sitio sin el panel. El modo de edición no guarda nada hasta que reemplaces `config.js` en GitHub.

También puedes modificar directamente los números de `config.js`. Un valor menor de `distance` acerca la cámara. `x` más negativo desplaza el personaje hacia la derecha; `y` mayor apunta hacia la cabeza.

## Editar contenido

- Cambia títulos, descripciones y enlaces en `index.html`. Sustituye las dos apariciones de `julian@example.com` por tu correo.
- Ajusta colores, tipografía y distribución en `style.css`.
- Sustituye `assets/personaje.glb` para usar otro personaje. Sus materiales y animaciones deben venir dentro del GLB. Luego ajusta las cámaras porque el modelo puede tener otra escala.
- `script.js` maneja el scroll, la carga del modelo y el editor. Los valores de encuadre viven únicamente en `config.js`.

## Publicar

Sube **el contenido de esta carpeta**, con `index.html` en la raíz del repositorio. En GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**. El sitio usa rutas relativas.

Para verlo antes de publicar: ejecuta `python3 -m http.server 8000` dentro de esta carpeta y abre `http://localhost:8000/?editar=1`. No abras `index.html` con doble clic (`file://`), porque los navegadores pueden bloquear la carga local del GLB. El componente 3D necesita conexión para cargar `model-viewer` desde su CDN.
