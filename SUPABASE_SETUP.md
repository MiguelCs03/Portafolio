# Panel privado de estadísticas

El portafolio incluye un panel propio en **`/admin`** para ver visitas, visitantes únicos,
tiempo de permanencia, scroll, países, dispositivos, referidos, proyectos más abiertos,
clics externos y conversión de contacto.

No usa cookies de terceros ni Google Analytics. Los datos son tuyos y viven en Supabase
(plan gratuito).

---

## 1. Crear el proyecto en Supabase

1. Entra a <https://supabase.com> y crea un proyecto gratuito.
2. Guarda la contraseña de la base de datos que te pida (no se usa en el frontend).

## 2. Crear las tablas

1. En Supabase abre **SQL Editor → New query**.
2. Copia y pega todo el contenido de [`supabase/schema.sql`](./supabase/schema.sql).
3. Pulsa **Run**. Debe terminar sin errores.

Esto crea:

- `portfolio_visits`: una fila por visita (país, dispositivo, referido, duración, scroll...).
- `portfolio_events`: eventos (`section_view`, `project_view`, `contact_submit`, `outbound_click`, etc.).
- Políticas RLS: cualquiera puede **insertar** una visita, pero solo un usuario
  autenticado puede **leer** o **borrar** los datos.
- Función `portfolio_touch_visit` para actualizar duración y scroll de forma segura.

## 3. Crear tu usuario (el único que podrá entrar)

1. Ve a **Authentication → Users → Add user → Create new user**.
2. Usa tu correo y una contraseña fuerte.
3. Activa **Auto Confirm User** (o confirma el correo que te llegue).

> No hay registro público. Si quieres crear otro usuario, hazlo desde el mismo panel de Supabase.

## 4. Conectar el frontend

En **Project Settings → API** copia:

- `Project URL`
- `anon public` key

Y pégalas en `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  supabaseUrl: 'https://tu-proyecto.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIs...',
};
```

La clave `anon` es pública por diseño: puede insertar visitas, pero **no puede leerlas**
porque las políticas RLS lo impiden. No pongas aquí la `service_role` key.

## 5. Desplegar

El panel es parte del mismo build de Angular:

```bash
npm run build
```

Sube `dist/portfolio/browser` a tu hosting (Vercel, Netlify, GitHub Pages, etc.).

> **Importante en hosting estático:** si entras directo a `/admin` y el servidor no
> conoce la ruta, puede devolver 404. Configura un rewrite de SPA hacia `index.html`:
>
> - **Vercel:** crea `vercel.json` con
>   `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
> - **Netlify:** crea `public/_redirects` con `/* /index.html 200`
> - **GitHub Pages:** usa un `404.html` copia de `index.html` (o hash routing).

## 6. Entrar

Abre `https://tudominio.com/admin` e inicia sesión con el usuario que creaste.

### Cambiar la URL del panel

Edita `src/app/app.routes.ts` y cambia `path: 'admin'` por la ruta que quieras,
por ejemplo `path: 'panel-mcs'`. La seguridad real la da el login + RLS, no el secreto
de la URL, pero una ruta no obvia evita escaneos automáticos.

### No contar tus propias visitas

Abre una vez `https://tudominio.com/?ignore-analytics=1` en tu navegador. Ese navegador
queda excluido para siempre (se guarda en `localStorage`). Para revertirlo:

```js
localStorage.removeItem('portfolio:ignore');
```

---

## Qué mide el panel

| Métrica                          | Para qué sirve                              |
| -------------------------------- | ------------------------------------------- |
| Visitantes únicos                | Personas reales, no recargas                |
| Visitas y sesiones               | Volumen y recurrencia                       |
| Crecimiento vs. periodo anterior | Saber si mejoras                            |
| Tiempo medio y scroll            | Si el contenido engancha                    |
| Países / idioma                  | Ajustar el idioma por defecto o ejemplos    |
| Dispositivos / navegadores       | Priorizar diseño móvil                      |
| Referidos                        | Qué red (LinkedIn, GitHub, Google) funciona |
| Proyectos más abiertos           | Qué proyecto genera interés                 |
| Secciones vistas                 | Dónde abandonan                             |
| Clics externos / contacto        | Intención real de contactarte               |
| Mejores horas                    | Cuándo publicar                             |
| Insights automáticos             | Recomendaciones concretas                   |

## Privacidad

- No se guardan IPs.
- El país/ciudad se obtiene con una petición a `ipapi.co` desde el navegador y solo se
  almacena el resultado.
- El identificador de visitante es un UUID aleatorio en `localStorage`; no identifica
  a la persona.
- Puedes borrar todo desde Supabase o desde el panel SQL.

## Solución de problemas

- **“Falta conectar la base de datos”**: revisa `environment.ts`; deben estar la URL y la
  anon key, sin los textos `PEGA_AQUI`.
- **“Invalid login credentials”**: el usuario no existe o la contraseña es incorrecta.
  Restablécelo en Supabase → Authentication → Users.
- **Login funciona pero no hay datos**: las políticas RLS no se ejecutaron. Vuelve a correr
  `supabase/schema.sql`.
- **No aparecen visitas nuevas**: abre la consola del navegador. Si ves un error de
  `portfolio_touch_visit` o de inserción, revisa los permisos del paso 2.
