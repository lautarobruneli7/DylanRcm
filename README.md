# Landing administrable de Dylan RCM

Landing pública + panel de administración (`/admin`). Todo el contenido vive en una base SQLite y se edita desde el panel: nadie necesita tocar código para actualizar novedades, videos, redes o textos.

## Puesta en marcha

Requiere **Node 22.13 o superior**.

```bash
npm run install:all   # instala web y server
npm run build         # compila el front
npm start             # http://localhost:3000  (panel en /admin)
```

La primera vez que se entra a `/admin` se pide **crear una contraseña** (mínimo 8 caracteres). Después se puede cambiar en Panel > Ajustes.

### Desarrollo

```bash
npm run dev:server    # API en :3000
npm run dev:web       # Vite en :5173 con proxy a la API
```

## Cómo funciona el panel

- **Borrador y publicado:** cada cambio se guarda solo como borrador. La web pública solo cambia al apretar **Publicar cambios**. **Descartar** vuelve a la última versión publicada.
- **Vista previa en vivo:** muestra la landing real con el borrador, en escritorio o celular, mientras se edita.
- **Videos:** pegar el link de YouTube (watch, youtu.be, shorts, live). Miniatura y título se obtienen solos; se puede subir una miniatura propia.
- **Novedades, videos, contactos, datos y links:** crear, editar, eliminar (con confirmación), ocultar/mostrar y reordenar arrastrando o con las flechas.
- **Ajustes:** color principal, título y descripción para Google/redes, imagen al compartir y cambio de contraseña.

## Estructura

```
server/src
  index.ts          servidor, SEO (inyecta título/Open Graph) y archivos estáticos
  db.ts             SQLite (node:sqlite): borrador, publicado, contraseña
  auth.ts           sesión por cookie firmada, límite de intentos
  content.ts        validación y saneo de URLs del contenido
  seed.ts           contenido inicial (datos de DylanRcm.docx)
  routes/           auth.ts, admin.ts (borrador, publicar, subir imágenes, YouTube)
web/src
  types/content.ts  modelo de contenido (fuente de verdad)
  landing/          Landing, sections/, components/  (sin textos propios)
  admin/            AdminApp, editors/, components/ (ListEditor reutilizable), hooks/useDraft
  lib/              api, icons (redes), youtube, image, url, format
  styles/index.css  tokens de diseño (colores, tipografías, botones, cards)
```

## Datos y respaldo

- Base e imágenes subidas: carpeta `server/data` (o la indicada en `DATA_DIR`). **Hacer copia de esa carpeta** es el respaldo completo.
- Variables opcionales: `PORT`, `DATA_DIR`, `SESSION_DAYS`.
- En hosting con disco efímero (Render/Railway gratis) hay que montar un volumen persistente en `DATA_DIR`, si no se pierde el contenido en cada deploy.

## Agregar una red nueva al selector

En `web/src/lib/icons.tsx`: importar el icono desde `simple-icons` y sumarlo a `ICONS`. Las redes sin icono propio se cargan igual con el icono genérico de link.
