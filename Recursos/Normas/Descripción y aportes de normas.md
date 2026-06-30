# Descripción y aportes de normas

## Proyecto: Creador de hábitats

Este documento resume las normas técnicas revisadas y explica cómo aportan al desarrollo del proyecto **Creador de hábitats**, un sistema inteligente orientado al monitoreo de variables del suelo y del ambiente para apoyar la recomendación de especies vegetales en procesos de reforestación urbana.

Las normas revisadas no se utilizan como una copia directa de implementación, sino como **referencias de diseño, seguridad, calidad, validación y evaluación** para justificar decisiones técnicas del sistema.

---

## 1. Norma Técnica 01: UIT-T X.1353 (09/2024)

### Nombre de la norma

**Recomendación UIT-T X.1353: Metodología de seguridad basada en cadenas de bloques para instalaciones sin intervención de IoT masiva.**

### Descripción general

La Recomendación UIT-T X.1353 pertenece a la serie X de la Unión Internacional de Telecomunicaciones, relacionada con redes de datos, comunicaciones de sistemas abiertos y seguridad. Esta norma se enfoca en la **seguridad de sistemas IoT masivos**, especialmente en escenarios donde una gran cantidad de dispositivos deben instalarse, autenticarse y recibir credenciales de manera automática, sin intervención manual del usuario.

La norma plantea una metodología de seguridad para plataformas de instalación sin intervención, considerando aspectos como:

- Gestión de identidad de dispositivos IoT.
- Provisión automática de credenciales.
- Autenticación de dispositivos.
- Protección de datos de identificación.
- Uso de mecanismos criptográficos.
- Comunicación segura mediante tecnologías como TLS.
- Posible uso de blockchain para registrar identidad, propiedad y credenciales de dispositivos.

Aunque el proyecto **Creador de hábitats** no es una red de IoT masiva ni implementa blockchain como parte principal del prototipo, esta norma sirve como referencia para justificar que el sistema debe considerar criterios de **seguridad, autenticación y protección de datos** desde la etapa de diseño.

### Aportes al proyecto

La norma aporta al proyecto principalmente en la parte de **comunicación IoT segura**. El sistema propuesto utiliza sensores conectados a un microcontrolador ESP32-S3, el cual puede enviar datos hacia una nube, dashboard o SCADA. Por ello, es importante que los datos transmitidos no se envíen de forma abierta o insegura.

El aporte más directo de esta norma es reforzar la necesidad de que el sistema utilice mecanismos de seguridad como:

- Envío de datos mediante HTTPS.
- Uso de TLS para proteger la comunicación.
- Identificación del dispositivo que envía los datos.
- Control de acceso a la plataforma o servidor.
- Manejo seguro de credenciales del dispositivo.
- Protección de información asociada al sistema, como ubicación, mediciones y estado de operación.

En el proyecto, esto se relaciona con la función de **enviar datos encriptados al sistema en la nube**. La norma permite sustentar que la comunicación entre el prototipo y la nube debe ser segura, especialmente porque el sistema puede manejar datos ambientales, coordenadas geográficas, resultados de compatibilidad y estado del dispositivo.

### Aplicación dentro del diseño del sistema

En el diseño del sistema, la norma puede aplicarse de la siguiente manera:

| Elemento del proyecto | Relación con la norma |
|---|---|
| ESP32-S3 | Actúa como dispositivo IoT que adquiere datos, procesa información y se comunica con sistemas externos. |
| Comunicación HTTPS | Permite enviar datos de forma segura hacia la nube usando cifrado. |
| SCADA o dashboard | Debe recibir información desde dispositivos autorizados, evitando accesos no deseados. |
| Credenciales del sistema | Deben gestionarse de forma segura para evitar uso indebido del dispositivo. |
| Datos de sensores | Deben transmitirse protegidos para mantener integridad y confiabilidad. |
| Coordenadas GPS | Requieren protección porque pueden representar información sensible de ubicación. |

### Importancia para el proyecto

La norma ayuda a justificar que el proyecto no debe ser visto solo como un sistema de medición, sino también como un **sistema IoT conectado**, donde la seguridad de la comunicación es parte del diseño de ingeniería. En una versión futura, si el sistema se instala en varios puntos de Lima Metropolitana, será necesario identificar cada dispositivo, proteger sus credenciales y asegurar que los datos enviados a la plataforma sean confiables.

Por ello, la UIT-T X.1353 aporta una base normativa para fortalecer el módulo de comunicación, el envío seguro de datos, la autenticación del sistema y la protección de información.

---

## 2. Norma Técnica 02: ISO/IEC 25010:2011

### Nombre de la norma

**ISO/IEC 25010:2011: Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models.**

### Descripción general

La norma ISO/IEC 25010:2011 define modelos de calidad para sistemas y productos de software. Forma parte de la familia de normas SQuaRE, orientada a los requisitos y evaluación de calidad del software y sistemas computacionales.

Esta norma propone dos modelos principales:

1. **Modelo de calidad en uso**, relacionado con el resultado de la interacción entre el usuario y el sistema.
2. **Modelo de calidad del producto**, relacionado con las propiedades del sistema y del software.

El modelo de calidad del producto considera características como:

- Adecuación funcional.
- Eficiencia de desempeño.
- Compatibilidad.
- Usabilidad.
- Fiabilidad.
- Seguridad.
- Mantenibilidad.
- Portabilidad.

Para el proyecto **Creador de hábitats**, esta norma es importante porque el sistema no solo tiene componentes electrónicos y mecánicos, sino también un componente de software encargado de ordenar datos, consultar información, calcular compatibilidad, generar recomendaciones y mostrar resultados al usuario.

### Aportes al proyecto

La norma aporta al proyecto porque permite establecer criterios de calidad para evaluar el sistema desarrollado. Estos criterios pueden usarse durante la selección del concepto de solución, la matriz de Pugh, la validación del prototipo y la definición de requisitos.

Los principales aportes son:

- Definir si el software cumple correctamente con su función de calcular la compatibilidad suelo-planta.
- Evaluar si el sistema responde en un tiempo adecuado al leer sensores y mostrar resultados.
- Verificar si el sistema es compatible con sensores, APIs, OLED, nube y SCADA.
- Evaluar si la interfaz local mediante pantalla OLED es clara y útil para el usuario.
- Analizar la fiabilidad del sistema frente a errores de lectura o fallas de conexión.
- Incorporar seguridad en el envío de datos y protección de credenciales.
- Facilitar el mantenimiento del código, sensores y módulos.
- Evaluar si el sistema puede adaptarse a futuras versiones o nuevos sensores.

### Aplicación dentro del diseño del sistema

La norma puede aplicarse directamente a diferentes partes del proyecto:

| Característica ISO/IEC 25010 | Aplicación en el proyecto |
|---|---|
| Adecuación funcional | El sistema debe medir variables, calcular HCI y recomendar especies correctamente. |
| Eficiencia de desempeño | El sistema debe procesar datos sin demoras excesivas y con consumo energético razonable. |
| Compatibilidad | Debe integrarse con sensores, ESP32-S3, pantalla OLED, APIs, SCADA y nube. |
| Usabilidad | La pantalla OLED debe mostrar información comprensible para el usuario. |
| Fiabilidad | El sistema debe operar de forma estable durante las pruebas de campo. |
| Seguridad | Los datos enviados a la nube deben protegerse mediante HTTPS/TLS. |
| Mantenibilidad | El diseño debe permitir corregir código, calibrar sensores y reemplazar módulos. |
| Portabilidad | El sistema debe poder adaptarse a otros lugares, especies o configuraciones de sensores. |

### Importancia para el proyecto

La ISO/IEC 25010 ayuda a convertir el software del proyecto en un componente evaluable y justificable. Gracias a esta norma, se puede afirmar que el sistema debe cumplir no solo con medir y recomendar, sino también con hacerlo de manera confiable, segura, clara, mantenible y compatible con los demás módulos.

En la matriz de Pugh, esta norma ayuda a sustentar criterios como:

- Capacidad de análisis y recomendación.
- Comunicación IoT y envío de datos.
- Explicabilidad del resultado.
- Facilidad de implementación.
- Facilidad de mantenimiento.
- Compatibilidad con el sistema de control.
- Seguridad de la información.

Por ello, la ISO/IEC 25010 es una referencia útil para evaluar la calidad general del sistema inteligente y para justificar que el proyecto cumple criterios de ingeniería de software y sistemas.

---

## 3. Relación de ambas normas con el proyecto

Ambas normas se complementan dentro del desarrollo del proyecto. La norma UIT-T X.1353 aporta criterios relacionados con la **seguridad e identidad de dispositivos IoT**, mientras que la ISO/IEC 25010 aporta criterios relacionados con la **calidad del software y del sistema**.

| Norma | Área principal | Aporte al proyecto |
|---|---|---|
| UIT-T X.1353 | Seguridad IoT | Justifica el uso de comunicación segura, autenticación, credenciales y protección de datos. |
| ISO/IEC 25010 | Calidad de software y sistemas | Justifica criterios de funcionalidad, usabilidad, fiabilidad, seguridad, mantenibilidad y compatibilidad. |

Estas normas permiten fortalecer el proyecto desde dos dimensiones importantes:

1. **Seguridad:** el sistema debe proteger los datos que envía y controlar el acceso a la información.
2. **Calidad:** el sistema debe cumplir su función de forma confiable, comprensible, mantenible y verificable.

---

## 4. Aporte concreto para el informe del proyecto

Las normas técnicas revisadas sirven para fundamentar que el sistema **Creador de hábitats** debe desarrollarse bajo criterios de seguridad, calidad y evaluación. La norma UIT-T X.1353 permite justificar la necesidad de proteger la comunicación IoT mediante HTTPS/TLS, gestionar credenciales y asegurar la identidad del dispositivo. Por otro lado, la norma ISO/IEC 25010 permite definir criterios de calidad para el software y el sistema, tales como adecuación funcional, eficiencia, compatibilidad, usabilidad, fiabilidad, seguridad, mantenibilidad y portabilidad.

De esta forma, las normas aportan una base técnica para mejorar la justificación del diseño, orientar la validación del prototipo y fortalecer la matriz de evaluación del proyecto.

---

## 5. Conclusión

Las normas revisadas son importantes porque permiten que el proyecto no se limite a la selección de sensores y componentes electrónicos, sino que también considere aspectos de seguridad, calidad de software, comunicación segura, confiabilidad y mantenimiento. En conjunto, estas normas respaldan el diseño de un sistema inteligente más completo, seguro y evaluable para apoyar procesos de reforestación urbana en zonas áridas.

