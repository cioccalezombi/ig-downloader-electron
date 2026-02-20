IG Downloader (Electron + gallery-dl)

Aplicación de escritorio para Windows desarrollada con Electron que
permite descargar automáticamente contenido de perfiles públicos de
Instagram usando gallery-dl.

------------------------------------------------------------------------

CARACTERÍSTICAS

-   Interfaz gráfica simple
-   Descarga por nombre de perfil
-   Opciones:
    -   Descargar todo
    -   Solo fotos
    -   Solo videos
-   Uso de cookies para autenticación
-   Carpeta de descargas fija dentro del proyecto
-   Generación de instalador .exe

------------------------------------------------------------------------

ESTRUCTURA DEL PROYECTO

IG-DOWNLOADER-ELECTRON/

cookies/ www.instagram.com_cookies.txt

downloads/

main.js
preload.js
renderer.js
index.html
config.js
package.json
README.txt

------------------------------------------------------------------------

REQUISITOS E INSTALACIÓN PASO A PASO

1)  Instalar Node.js

-   Ir a: https://nodejs.org
-   Descargar versión LTS
-   Instalar normalmente

Verificar instalación:

node -v
npm -v

------------------------------------------------------------------------

2)  Instalar Python

-   Ir a: https://www.python.org/downloads/
-   Descargar última versión
-   IMPORTANTE: marcar “Add Python to PATH” durante la instalación

Verificar instalación:

python –version

------------------------------------------------------------------------

3)  Instalar gallery-dl

Abrir PowerShell y ejecutar:

pip install -U gallery-dl

Verificar:

gallery-dl –version

------------------------------------------------------------------------

4)  Exportar cookies de Instagram

-   Instalar extensión de Chrome:
    Get cookies.txt LOCALLY

-   Ir a: https://www.instagram.com

-   Iniciar sesión

-   Exportar cookies

Guardar archivo en:

cookies/www.instagram.com_cookies.txt

------------------------------------------------------------------------

EJECUTAR EN MODO DESARROLLO

Desde la carpeta del proyecto:

npm install
npm start

------------------------------------------------------------------------

GENERAR INSTALADOR .EXE

npm run build

El instalador se genera en:

dist/

------------------------------------------------------------------------

FUNCIONAMIENTO

1)  Escribir nombre del perfil (sin @)
2)  Elegir tipo de descarga:
    -   Todo
    -   Solo fotos
    -   Solo videos
3)  Presionar Descargar
4)  Los archivos se guardan en:

downloads/

------------------------------------------------------------------------

LIMITACIONES

-   Solo perfiles públicos
-   No descarga stories
-   Depende de cookies válidas
-   Instagram puede aplicar límites de descarga

Si ocurre error:

-   Verificar que la sesión de Instagram esté activa
-   Re-exportar cookies
-   Esperar unos minutos antes de intentar nuevamente

------------------------------------------------------------------------

SEGURIDAD

La aplicación:

-   No almacena contraseñas
-   Solo utiliza el archivo de cookies exportado
-   No envía datos a terceros

------------------------------------------------------------------------

TECNOLOGÍAS UTILIZADAS

-   Electron
-   Node.js
-   gallery-dl
-   HTML / CSS / JavaScript

------------------------------------------------------------------------

NOTA IMPORTANTE

El instalador no incluye gallery-dl dentro del ejecutable.
Debe estar instalado previamente en el sistema.

------------------------------------------------------------------------

LICENCIA

Proyecto de uso personal y educativo.
