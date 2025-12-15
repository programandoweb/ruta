// global.d.ts o typings.d.ts

declare module "*.css" {
  // Aquí declaramos que cualquier archivo que termine en .css
  // es un módulo, y no necesita exportar nada.
  // Esto silencia el error ts(2882).
}