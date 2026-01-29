# hp-dev-jobberwocky

Se te ha pedido implementar **Jobberwocky**, un servicio que funciona como un almacén de oportunidades laborales, donde las empresas pueden compartir vacantes.

## 1. Crear un servicio de publicación de empleos

Implementa una aplicación que exponga una API que permita a los usuarios registrar nuevas oportunidades laborales.
- La aplicación no necesita persistir información en un servicio de base de datos externo.
- Siéntete libre de almacenar los empleos en memoria o en disco (CSV, SQLite, etc.).
- Elige cualquier estilo de API: basada en web, REST, GraphQL, etc.

## 2. Crear un servicio de búsqueda de empleos

Extiende tu aplicación para exponer otro endpoint que permita a los usuarios encontrar oportunidades laborales desde el servicio que ya has creado.

## 3. Crear fuentes adicionales

Además de nuestro servicio interno de empleos, queremos que nuestro servicio de búsqueda de empleos consuma datos de fuentes adicionales de oportunidades laborales. Para lograr esto, necesitamos consumir [jobberwocky-extra-source](https://github.com/avatureta/jobberwocky-extra-source-v2), que, como habrás notado, proporciona datos en un formato de respuesta bastante desordenado. Encuentra la mejor manera de devolver una respuesta que combine resultados de múltiples fuentes.

NOTA: No debes realizar ningún cambio en el proyecto jobberwocky-extra-source. Solo debes ejecutar el servicio y consumir sus datos desde tu aplicación Jobberwocky.

## 4. Crear un servicio de Alertas de Empleo (opcional)

Actualiza tu aplicación para que permita a los candidatos suscribirse a una dirección de correo electrónico y ser notificados cada vez que se publique un nuevo empleo. Se puede proporcionar un patrón de búsqueda opcional como forma de filtrar las publicaciones de empleos.

## Preguntas frecuentes (FAQ)

### ¿Necesito crear una interfaz de usuario (UI)?

Solo evaluaremos el backend, pero puedes construir una si te apetece.

### ¿La aplicación requiere autenticación?

No, no la requiere.

### ¿Qué campos debo usar para cada entidad?

Como desarrollador/a, esperamos que diseñes la estructura adecuada para cada entidad, como las entidades de trabajo (job) o de suscripción (subscription).

### ¿Puedo usar un framework externo?

Sí, siéntete libre de elegir cualquier framework que se adapte a tus necesidades.

### ¿Qué lenguaje de programación debo usar?

Puedes usar: C++, C#, Python, Java/Kotlin, Javascript/Node/Typescript, PHP, Ruby. Si prefieres usar un lenguaje diferente, por favor háznoslo saber antes de comenzar.

### ¿En qué lenguaje debo programar?

En inglés, por favor.

### ¿Puedo resolver el ejercicio en un fork?

No, solo evaluaremos soluciones en el repositorio creado por Avature.
