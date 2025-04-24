# Proyecto ADS

Este es un entorno de desarrollo para una aplicación web utilizando:

- **Express**: Para la creación del servidor y manejo de rutas.
- **Sass**: Preprocesador CSS para los estilos de la aplicación.
- **Nodemon**: Reinicio automático del servidor durante el desarrollo.
- **Concurrently**: Permite correr múltiples scripts en paralelo (Sass + JS).

## Requisitos

Para ejecutar esta aplicación en tu máquina local necesitas tener instalados los siguientes programas:

- **Node.js** v18+ [Node.js](https://nodejs.org/en/)

## Instalación

1. Instala las dependencias de Node.js:

    ```bash
    npm install
    ```

2.  Iniciar el servidor con Nodemon:

    ```bash
    npm run server
    ```

3.  Compilar Sass en tiempo real:

    ```bash
    npm run dev
    ```