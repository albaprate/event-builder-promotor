# Event Builder Promotor

Base del **lado promotor** (admin) para Baila.fm. Duplicado desde `event-builder-plus` (flujo fan).

## Qué incluye

- Mismo design system (tipografías, colores, componentes UI)
- Rutas iniciales: `/eventos`, `/eventos/nuevo`
- Sin checkout, entradas ni carrito del flujo fan

## Desarrollo

```sh
cd event-builder-promotor
npm i
npm run dev
```

Abre `http://localhost:8081/` → redirige a `/eventos`.

> El proyecto fan (`event-builder-plus`) usa el puerto **8080** por defecto; este promotor usa **8081** para poder tener ambos abiertos a la vez.

## Repo

Crea un repo nuevo en GitHub (ej. `event-builder-promotor`) y sube:

```sh
git init -b main
git add -A && git commit -m "Initial promoter base from fan project"
git remote add origin git@github.com:TU_USUARIO/event-builder-promotor.git
git push -u origin main
```
