# Desafío Fullstack Developer - FX Replay

Sigue las instrucciones cuidadosamente y proporciona tus soluciones de manera limpia, organizada y eficiente.
Se espera que compartas tu pantalla y tengas este nuevo proyecto funcionando localmente.
Puedes usar cualquier recurso a tu disposición.

### Contexto: ¿Qué es una Orden de Trading?

Una **orden de trading** es una instrucción dada por un trader para **comprar** o **vender** un activo financiero bajo condiciones específicas. Las órdenes se pueden categorizar según su tipo de ejecución:

- **Órdenes de Mercado (Market Orders)**
- **Órdenes Límite (Limit Orders)**
- **Órdenes de Tope (Stop Orders)**

Estas órdenes son comúnmente utilizadas en mercados de valores, intercambios de criptomonedas y trading de forex.
El modelo `trade_order` representa estas órdenes y sus atributos en una base de datos.

---

### **Parte 1: Construir una API RESTful**

Usando **Node.js**, crea una API RESTful para gestionar el recurso `trade_order`. La API debe seguir las siguientes especificaciones:

1. **Especificaciones del Modelo de Base de Datos**:
    - **Nombre de la Tabla**: `trade_order`
    - **Columnas**:
        - `id`: Un identificador único de tipo string (UUID).
        - `side`: Un string, los valores posibles son `"buy"` (compra) o `"sell"` (venta), requerido.
        - `type`: Un string, los valores posibles son `"limit"`, `"market"`, `"stop"`, requerido.
        - `amount`: Un número decimal, máximo 2 decimales, requerido.
        - `price`: Un número decimal, máximo 5 decimales, requerido.
        - `status`: Un string, los valores posibles son `"open"`, `"cancelled"`, `"executed"`. El valor por defecto es `"open"`.
        - `pair`: Un string que representa el par de trading (ej., `BTCUSD`), requerido.
        - `createdAt`: Una marca de tiempo (timestamp) que representa cuándo se creó la orden.
        - `updatedAt`: Una marca de tiempo que representa cuándo se actualizó la orden por última vez.
2. **Endpoints**:
    - `POST /trade_orders`: Crear una nueva orden.
    - `GET /trade_orders`: Obtener una lista de todas las órdenes.
3. **Configuración Local**:
    - Puedes elegir tu stack preferido para construir la solución. Tenemos una ligera preferencia por Express o NestJs (o cualquier cosa con Node).
4. **Requisitos**:
    - Asegura un manejo adecuado de errores y códigos de estado (ej., `400` para solicitudes incorrectas, `404` para no encontrado, `500` para errores del servidor).
    - Escribe código modular y limpio organizando el proyecto en rutas, controladores y modelos de base de datos.

---

### **Parte 2: Implementar el Frontend**

1. Páginas requeridas:
    - `/trades`: Al cargar, realiza una solicitud GET a `/trade_orders` y muestra las operaciones actuales.
    - `/trades/new`: Solicita los parámetros de la operación y realiza una solicitud POST a `/trade_orders`.
2. **Configuración Local**:
    - Puedes elegir tu stack preferido para construir la solución. Tenemos una ligera preferencia por Angular (o cualquier framework de JS).
3. Requisitos:
    - Usa cualquier librería de estilos (PrimeNG, Bootstrap, Material). Sin embargo, enfócate en la funcionalidad; las elecciones de diseño de la interfaz de usuario son secundarias.

---

### **Parte 3: Implementar Validaciones para el Precio de la Orden**

Supongamos que los precios actuales para los pares de trading son los siguientes:

- **BTCUSD**: `100150.4`
- **EURUSD**: `1.035`
- **ETHUSD**: `3310`

1. **Órdenes Límite (Limit Orders)**:
    - Si la orden es una orden límite de **compra**, el precio debe ser **menor que el precio de mercado actual** del par.
    - Si la orden es una orden límite de **venta**, el precio debe ser **mayor que el precio de mercado actual** del par.
2. **Órdenes de Mercado (Market Orders)**:
    - No se necesita validación de precio, ya que las órdenes de mercado se ejecutan al precio de mercado actual.
3. **Órdenes de Tope (Stop Orders)**:
    - Si la orden es una orden stop de **compra**, el precio debe ser **mayor que el precio de mercado actual** del par.
    - Si la orden es una orden stop de **venta**, el precio debe ser **menor que el precio de mercado actual** del par.
4. **Validaciones Adicionales**:
    - Asegura que el `amount` (monto) sea mayor que `0`.
    - Valida que el `pair` (par) exista en los precios de mercado actuales (`BTCUSD`, `EURUSD`, `ETHUSD`).
    - Rechaza órdenes con un `type` (tipo) o `side` (lado) inválido.

---

### Parte 4: Tareas adicionales de bonificación

1. Implementa pruebas unitarias en los lugares más útiles.
2. Implementa los siguientes endpoints:
    - `GET /trade_orders/:id`: Obtener una sola orden por su `id`.
    - `PUT /trade_orders/:id`: Actualizar una orden existente.
    - `DELETE /trade_orders/:id`: Elminar una orden.
3. Implementa la UI para los nuevos endpoints según creas conveniente.
4. Otras tareas:
    - Agrega paginación al endpoint `GET /trade_orders`.
    - Implementa borrado lógico (soft delete) en el endpoint `DELETE /trade_orders/:id`.
    - Implementa Swagger para la documentación de la API.

---

### **Criterios de Evaluación**

- Cumplimiento de los requisitos e instrucciones.
- Calidad y organización del código.
- Implementación correcta de las validaciones.
- Manejo eficiente de las operaciones de base de datos.
- Manejo de errores y respuestas de la API.
