# Library UI

Aplicación en Angular para gestionar libros y autores. Consume [library-api](https://github.com/ElRoy14/library-api), que a su vez funciona como proxy de [FakeRestAPI](https://fakerestapi.azurewebsites.net/index.html).

## Requisitos

- [Node.js](https://nodejs.org/) 22 LTS o superior
- [library-api](https://github.com/ElRoy14/library-api) corriendo en `https://localhost:7100`

## Cómo ejecutarlo

Primero levanta el backend siguiendo su README. Luego:

```bash
git clone https://github.com/ElRoy14/library-ui.git
cd library-ui
npm install
npm start
```

La aplicación queda en `http://localhost:4200`.

## Funcionalidades

- **Libros:** lista con título y descripción, detalle con sus autores, y opciones para agregar, editar y eliminar.
- **Autores:** tabla paginada con nombre y número de libros publicados, y opciones para agregar, editar y eliminar. Al crear o editar un autor, el libro se elige de una lista.

## Estructura

```
src/app/
├── core/       interceptor de errores HTTP
├── shared/     diálogo de confirmación
├── books/      feature de libros
└── authors/    feature de autores
```

Cada feature tiene sus propias carpetas de `models`, `services`, `pages` y `components`, y se carga con lazy loading desde `app.routes.ts`.

Algunas decisiones:

- Componentes standalone y estado con signals.
- Los formularios están en diálogos y solo devuelven los datos ingresados. La página que los abre se encarga de llamar a la API y actualizar la lista.
- Los errores HTTP se manejan en un solo interceptor, que muestra un mensaje según el código de respuesta.
- Angular Material es la única librería de UI. El paginador conserva sus textos por defecto, en inglés.
