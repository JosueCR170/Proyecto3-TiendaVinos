Universidad Nacional
Escuela de Informática

Proyecto: Programación Web — Proyecto 3

Autores:
- Daniel Gonzalez Picado
- Josue David Solorzano Ordoñez

Título: La Última Botella — Tienda de Vinos (Front-end con PrimeVue + PrimeFlex)

Descripción del entregable
--------------------------
En este proyecto se ha modificado únicamente la capa de presentación del frontend desarrollada en el Proyecto 2. Se sustituyeron todos los elementos de la interfaz por componentes web usando PrimeVue y PrimeFlex. Todas las demás funcionalidades se mantienen tal como estaban (lógica Vue, controladores y rutas de Vue, y comunicación RESTful con el backend en PHP).

Requisitos funcionales mantenidos
--------------------------------
- Uso de Vue.js para la estructura y lógica del frontend.
- Comunicación RESTful con la API PHP del backend.
- No se mezclaron frameworks de UI (solo PrimeVue + PrimeFlex para la nueva interfaz).

Qué se cambió
-------------
- Se reemplazaron vistas y componentes de UI por componentes de PrimeVue.
- Se aplicó PrimeFlex para la maquetación responsiva y utilidades CSS.
- Se preservaron todos los controladores, stores, servicios HTTP y rutas existentes.


Publicación
-----------
- Aplicación frontend publicada en: https://proyecto3-tiendavinos-production.up.railway.app/

Instrucciones para reproducir y desplegar (frontend)
----------------------------------------------------
1. Abrir la carpeta `front-tienda-vinos`.
2. Instalar dependencias (usar `npm` o `pnpm` según prefieras):

```bash
npm install
# o
pnpm install
```

3. Ejecutar en modo desarrollo:

```bash
npm run dev
# o
pnpm dev
```

4. Generar la versión para producción (carpeta `dist`):

```bash
npm run build
# o
pnpm build
```

5. Verificar el contenido de `dist/` y desplegar SOLO esa carpeta al servicio de hosting (por ejemplo, en InfiniteFree, GitHub Pages, Netlify, o Railway). NO subir `node_modules` ni las herramientas de compilación al hosting.

Notas importantes
-----------------
- No se deben combinar frameworks CSS/UI diferentes (por ejemplo, Bootstrap + PrimeVue está prohibido).
- Todo el código no relacionado con la apariencia (lógica, controladores, rutas, llamadas REST) permanece sin cambios.
- Si se requiere ejecutar la aplicación completa (frontend + backend) localmente, asegúrate de tener el backend corriendo y configurar la URL base de la API en el archivo de configuración correspondiente.

Contacto y créditos
-------------------
Proyecto realizado para la asignatura Programación Web.
Autores: Daniel Gonzalez Picado y Josue David Solorzano Ordoñez.

Enlace público: https://proyecto3-tiendavinos-production.up.railway.app/
