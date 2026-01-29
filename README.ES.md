# 🎙️ Sistema de Órdenes de Trading: Inmersión Arquitectónica Profunda

> **Contexto de Entrevista Técnica**: Este proyecto está estructurado no solo como una solución a un desafío, sino como una demostración de decisiones arquitectónicas de alto nivel, principios de código limpio (Clean Code) y estándares empresariales listos para producción.

---

## 🏛️ Visión Arquitectónica y Decisiones de Diseño

### 1. La Elección del Monorepo (pnpm Workspaces)
**Pregunta: ¿Por qué usar un Monorepo para un desafío de un solo servicio?**
**Respuesta**: Por escalabilidad y contexto compartido. Usando **pnpm workspaces**, hemos creado un entorno donde la `apps/api` (Backend) y `apps/web` (Frontend) coexisten bajo una única fuente de verdad.
-   **Compartición Estricta de Tipos**: Aunque actualmente están separados, la arquitectura está preparada para mover DTOs e Interfaces a `packages/shared`, asegurando que un cambio en el esquema del backend se refleje instantáneamente como un error de tipos en el frontend.
-   **Orquestación**: Un solo comando `pnpm dev` gestiona ambos servidores de desarrollo, reduciendo significativamente la fricción para el desarrollador.

### 2. Backend: NestJS y Modularidad Escalable
**Pregunta: ¿Por qué NestJS en lugar de una configuración simple con Express?**
**Respuesta**: NestJS proporciona una infraestructura robusta "out-of-the-box" basada en conceptos similares a Angular (Módulos, Servicios, Controladores).
-   **Inyección de Dependencias (DI)**: Al utilizar el contenedor DI de Nest, aseguramos que nuestro `TradeOrdersService` sea fácilmente reemplazable por mocks para pruebas unitarias, cumpliendo con el principio de **Inversión de Dependencias**.
-   **Desarrollo Basado en Decoradores**: Aprovechamos los decoradores para todo, desde la documentación de la API (Swagger) hasta la validación de peticiones (`class-validator`), lo que mantiene la lógica de negocio limpia de código repetitivo de validación.

### 3. Frontend: Next.js (App Router) y SSR
**Pregunta: ¿Cuál fue la estrategia para el Frontend?**
**Respuesta**: Elegimos **Next.js** para aprovechar su naturaleza híbrida.
-   **Server Components y Actions**: Utilizamos Server Actions para mutaciones de datos (Crear, Borrar). Esto nos permite mantener la lógica sensible en el servidor mientras actualizamos la interfaz sin necesidad de una gestión de estado compleja en el cliente (como Redux).
-   **SEO y Velocidad**: El Renderizado del Lado del Servidor (SSR) garantiza que la lista inicial de trades se entregue al cliente como HTML puro, mejorando el Tiempo de Interactividad (TTI).
-   **Experiencia de Usuario (UX)**: Implementamos un tema "Silk" usando **DaisyUI** y efectos de **Glassmorphism** para ofrecer una sensación premium y moderna que va más allá de un MVP básico.

---

## 💎 Principios de Ingeniería Fundamentales

### 🧱 Aplicación de SOLID
1.  **S (Responsabilidad Única)**:
    -   `Controllers`: Gestionan el enrutamiento HTTP y el mapeo de entrada.
    -   `Services`: Contienen la lógica pura de negocio del dominio (ej. validaciones de precios).
    -   `Entities`: Definen la estructura de datos y el mapeo de la base de datos.
2.  **O (Abierto/Cerrado)**: El motor de validación en `TradeOrdersService` está diseñado para ser fácilmente extensible. Añadir un nuevo par de divisas o un nuevo tipo de orden no requiere reescribir la lógica central; simplemente se extienden las constantes y las reglas de validación.
3.  **L (Sustitución de Liskov)**: Utilizamos una clase abstracta `BaseEntity` de la cual heredan todas las entidades. Esto garantiza que todas compartan campos de auditoría comunes (`id`, `created_at`, `deleted_at`) de manera consistente.
4.  **D (Inversión de Dependencias)**: Los módulos de alto nivel no dependen de detalles de bajo nivel de la base de datos; dependen de abstracciones (patrón Repository proporcionado por TypeORM).

### 🏷️ Domain-Driven Design (DDD) Lite
Aunque no implementamos un DDD táctico completo, aplicamos varios conceptos:
-   **Capa de Servicio Rica**: El `TradeOrdersService` actúa como el guardián de las reglas del dominio, evitando la creación de estados de órdenes inválidos.
-   **Lenguaje Ubicuo**: Terminología como "Side" (Compra/Venta), "Type" (Límite/Mercado/Tope) y "Pair" (BTCUSD) es consistente desde el esquema de la base de datos hasta las etiquetas de la UI.

---

## 🛠️ Funcionalidades Destacadas

### 📉 Motor de Validación Complejo
Validado estrictamente contra precios de mercado en tiempo real:
-   **Órdenes Límite**: Compra por debajo del mercado, Venta por encima del mercado.
-   **Órdenes Stop**: Compra por encima del mercado, Venta por debajo del mercado.
-   **Órdenes de Mercado**: Ejecución instantánea sin necesidad de validación de precio.

### ♻️ Soft Delete (Borrado Lógico) para Auditoría
En lugar de eliminar físicamente los datos, utilizamos `@DeleteDateColumn` de TypeORM.
-   **¿Por qué?**: En sistemas financieros, la auditoría es crítica. Nunca perdemos el historial.
-   **Integración de UX**: En el frontend, las órdenes borradas permanecen visibles con una `opacity-50` y una etiqueta de **BORRADO**, permitiendo a los administradores ver el historial completo de actividad.

### 📜 Docs Interactivos (Swagger)
Ubicado en `/api/docs`, la integración de Swagger proporciona un Sandbox donde los desarrolladores pueden:
-   Visualizar toda la superficie de la API.
-   Ver los esquemas de los DTOs.
-   Realizar peticiones reales y ver las respuestas en tiempo real.

---

## 🧪 Calidad y Verificación

-   **Pruebas Unitarias**: Pruebas exhaustivas con Jest para el `TradeOrdersService` aseguran que los casos de borde (montos inválidos, direcciones de precio incorrectas) se detecten automáticamente.
-   **Seguridad de Tipos**: Se aplica TypeScript estrictamente en ambas aplicaciones para prevenir errores de "undefined" en tiempo de ejecución.

---

## 🚀 Instrucciones de Configuración

1.  **Requisitos**: Node.js 20+, pnpm v8+, MySQL.
2.  **Instalación**: `pnpm install`
3.  **Base de Datos**: La API crea automáticamente la base de datos si no existe, basándose en las credenciales de tu `.env` en `apps/api`.
4.  **Ejecución**: `pnpm dev`

---

**Max Shtefec** - *Software Architect / Full Stack Developer*
[GitHub](https://github.com/maxshdev) | [LinkedIn](https://linkedin.com/in/maxshtefec)
