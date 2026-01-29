# 🚀 Jobberwocky: Desafío de Bolsa de Empleo Empresarial

> **Contexto de la Entrevista Técnica**: Este proyecto es una solución integral al desafío "Jobberwocky". Demuestra decisiones arquitectónicas avanzadas, código limpio (SOLID) y estándares empresariales profesionales, incluyendo características que van mucho más allá de los requisitos iniciales.

---

## 🏛️ Descripción General de la Arquitectura

Este proyecto está construido como un **Monorepo** utilizando **pnpm workspaces**, lo que garantiza una experiencia de desarrollo unificada y un contexto compartido.

### 1. El Stack Tecnológico
- **Backend**: NestJS (framework de Node.js) para una API modular, escalable y fácil de mantener.
- **Frontend**: Next.js (App Router) con SSR para una interfaz de usuario de alto rendimiento y amigable con el SEO.
- **Base de Datos**: 
  - **Principal**: MySQL (Configuración estándar de producción).
  - **Portable**: Versión SQLite (`apps/api-sqlite`) para demostraciones sin configuración.
- **Estilo**: Tailwind CSS + DaisyUI para una estética "Silk" moderna y premium.

---

## ✅ Requisitos del Desafío vs. Implementación

| Requisito | Estado | Detalle de la Implementación |
| :--- | :---: | :--- |
| **1. Servicio de Publicación** | ✅ | API REST para registrar nuevas oportunidades laborales. |
| **2. Servicio de Búsqueda** | ✅ | Endpoint de búsqueda interna para empleos registrados. |
| **3. Fuentes Externas** | ✅ | Consumo y normalización de `jobberwocky-extra-source-v2`. |
| **4. Alertas de Empleo (Opcional)** | ✅ | Servicio de suscripción por correo con filtrado por palabras clave. |
| **Sin DB Externa Obligatoria** | ✅ | Aunque usamos MySQL/SQLite, está diseñado para una configuración sencilla. |
| **Sin Auth Obligatoria** | ✅ | **Plus**: Se implementó un sistema de Autenticación completo (ver abajo). |

---

## 💎 Características "Plus" (Más allá del Desafío)

Aunque el desafío se centraba en funcionalidades básicas de API, he implementado varias características de nivel empresarial para demostrar una mentalidad preparada para producción:

### 1. Autenticación Completa y Roles
- **Seguridad JWT**: Acceso seguro a rutas protegidas.
- **Control de Acceso Basado en Roles (RBAC)**: Diferentes permisos para Administradores y Candidatos.
- **Persistencia de Sesión**: Estado de inicio de sesión persistente en el frontend.

### 2. Gestión Avanzada de Empleos
- **Aplicaciones a Empleos**: Los candidatos pueden aplicar a los empleos, no solo verlos.
- **Perfiles de Usuario**: Perfiles detallados tanto para candidatos como para reclutadores.
- **Eliminación Lógica (Soft Deletes)**: Los datos nunca se pierden; eliminación compatible con auditoría mediante TypeORM.

### 3. Frontend Profesional (i18n)
- **Internacionalización**: Soporte completo para Inglés y Español.
- **UI Premium**: Efectos de glassmorphism, micro-animaciones y diseño responsivo.
- **Server Actions**: Mutaciones de datos modernas utilizando Next.js Server Actions.

### 4. Experiencia del Desarrollador (DX)
- **Documentación Swagger**: Pruebas de API interactivas disponibles en `/api/docs`.
- **Versión Portable**: `apps/api-sqlite` permite ejecutar el backend sin un servidor MySQL.
- **Seeds de Datos**: Generación automática de datos de prueba para testeo inmediato.

---

## 🛠️ Estructura del Proyecto

- `apps/api`: API principal de NestJS (MySQL).
- `apps/api-sqlite`: API portable de NestJS (SQLite).
- `apps/web`: Frontend de Next.js.
- `apps/jobberwocky-extra-source-v2`: La fuente externa local proporcionada por el desafío.

---

## 🚀 Cómo Empezar

1. **Prerrequisitos**: Node.js 20+, pnpm.
2. **Instalar Dependencias**: `pnpm install`
3. **Entorno**: Copia `.env.example` a `.env` en `apps/api` y `apps/web`.
4. **Ejecutar Todo**:
   ```bash
   pnpm dev
   ```
   *Esto iniciará la API, el Frontend y el servicio de la Fuente Extra simultáneamente.*

---

## 📜 Documentación de la API

Una vez que el servidor esté funcionando, visita:
- **Docs API Principal**: `http://localhost:4000/api/docs`
- **Docs API SQLite**: `http://localhost:4001/api/docs` (si está en ejecución)

---

**Max Shtefec** - *Software Architect / Full Stack Developer*
[GitHub](https://github.com/maxshdev) | [LinkedIn](https://linkedin.com/in/maxshtefec)
