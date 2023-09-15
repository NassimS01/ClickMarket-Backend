# Repositorio de Backend con Node.js 

![Logo Imagen](https://github.com/NassimS01/Supermarket/blob/dev_mauro/frontend/src/assets/CLICK.png?raw=true)

Bienvenido al repositorio de backend para el proyecto final de Rolling Code.
Este repositorio contiene el código base para el backend de nuestra aplicación, construida con node.js y varias dependencias útiles.
Este README te guiará a través de la configuración, uso y características del proyecto.

## Tabla de Contenidos

Dependencias

Aclaraciones

Empezando

Deploy Final

Contribuciones

## Dependencias

Este proyecto utiliza las siguientes dependencias:

* **bcryptjs:** Utilizada para el hashing seguro de contraseñas.
* **cloudinary:** Alojamiento para las imágenes del proyecto.
* **cookie-parser:** Middleware para trabajar con cookies en Express.
* **cors:** Middleware para habilitar CORS (Cross-Origin Resource Sharing).
* **dotenv:** Carga de variables de entorno desde el archivo .env.
* **Express:** Framework para la construcción de aplicaciones web en Node.js
* **jsonwebtoken:** Utilizada para generar y verificar tokens JWT.
* **mongoose:** ODM (Object Data Modeling) para trabajar con MongoDB.
* **multer:** Middleware de Node.js utilizado para gestionar la carga de archivos en aplicaciones web.
* **stripe:** Stripe es una plataforma de pagos en línea que facilita la aceptación de pagos en aplicaciones web y móviles.
* **sendgrid:** Servicio para enviar correos electrónicos, utilizada para confirmar cuenta.

## Aclaraciones
* **stripe:** Stripe tiene limitaciones de carácteres en el modo desarrollador por ende a la hora de cargar más de dos productos no permite realizar la compra.
Documentación: https://stripe.com/docs/api/metadata
Fake card: 4000000320000021 - Se puede colocar cualquier fecha de vencimiento y cvc

## Empezando
Para comenzar con el proyecto, sigue estos pasos:
1. Clona este repositorio en tu máquina local usando:
```sh
  git clone https://github.com/NassimS01/ClickMarket-Backend.git
 ```
2. Instala las dependencias del proyecto:
```sh
npm install
```

3. Inicia el servidor de desarrollo:
```sh
npm run dev
```

## Deploy Final
El Proyecto ha sido desplegado y se puede acceder en: 
https://clickmarket.vercel.app/

## Contribuciones
- [Salomón, Nassim](https://github.com/NassimS01)
- [Pérez,Mauro](https://github.com/Maurops92)
- [Guevara, Franco](https://github.com/FrancoLadronDeGuevara)
- [Paez, Francisco](https://github.com/FranX-21) 
- [Hernandez,Agustina](https://github.com/agustinahernandez17)


