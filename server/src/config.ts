// ==================== CONFIGURACIÓN ====================
// Variables de entorno soportadas (todas opcionales):
//   PORT          Puerto del servidor (default 3000)
//   DATA_DIR      Carpeta donde viven la base SQLite y las imágenes subidas (default ./data)
//   SESSION_DAYS  Duración de la sesión del admin en días (default 30)
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port: Number(process.env.PORT ?? 3000),
  dataDir: path.resolve(process.env.DATA_DIR ?? path.join(here, "../data")),
  seedAssetsDir: path.join(here, "../seed-assets"),
  webDistDir: path.join(here, "../../web/dist"),
  sessionDays: Number(process.env.SESSION_DAYS ?? 30),
  maxUploadBytes: 6 * 1024 * 1024,
};

export const uploadsDir = path.join(config.dataDir, "uploads");
