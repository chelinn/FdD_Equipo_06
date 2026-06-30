# Descripción y aportes de tesis

## Propósito del documento

El presente documento resume y relaciona los aportes de dos tesis vinculadas con sistemas IoT, monitoreo ambiental, medición de variables del suelo y transmisión de datos hacia plataformas digitales. Estas tesis sirven como antecedentes técnicos para el proyecto **Creador de hábitats**, ya que permiten justificar decisiones de diseño relacionadas con sensores, microcontroladores, comunicación inalámbrica, almacenamiento en la nube, visualización de datos y validación experimental.

---

## Tesis 1: Diseño de un sistema IoT para el monitoreo de salinidad del suelo en los cultivos del distrito de San José – Cartavio

### Descripción general

La tesis titulada **“Diseño de un sistema IoT para el monitoreo de salinidad del suelo en los cultivos del distrito de San José – Cartavio”** fue desarrollada en la Universidad Privada Antenor Orrego, en el programa de Ingeniería Electrónica. El trabajo se enfoca en el diseño de un sistema IoT para monitorear la salinidad del suelo en una zona agrícola, considerando que la salinidad es un factor crítico que puede afectar la productividad de los cultivos.

El sistema propuesto se basa en la medición de la **conductividad eléctrica del suelo**, utilizando un sensor CWT-Soil-THC-S conectado a un ESP32 mediante un módulo MAX485 para comunicación RS485. Los datos obtenidos son enviados mediante el protocolo MQTT hacia una Raspberry Pi, la cual actúa como intermediaria para enviar la información a la plataforma Ubidots. Esta plataforma permite almacenar los datos en la nube y visualizarlos mediante un dashboard con historial de mediciones.

### Aportes principales para el proyecto

Esta tesis aporta una referencia directa para el proyecto **Creador de hábitats**, debido a que trabaja con una variable fundamental para el análisis edáfico: la **conductividad eléctrica del suelo**. En nuestro proyecto, esta variable también es importante porque permite estimar la presencia de sales en el suelo y evaluar si las condiciones son favorables para determinadas especies vegetales.

El primer aporte relevante es la validación del uso de sensores de conductividad eléctrica en sistemas IoT agrícolas. La tesis demuestra que es posible integrar sensores de CE con microcontroladores como el ESP32, utilizando módulos de comunicación como MAX485 cuando el sensor trabaja con RS485. Esto se relaciona directamente con nuestro uso de un sensor **MODBUS-RTU RS485 Soil EC**, el cual requiere una comunicación industrial más robusta que una lectura analógica simple.

El segundo aporte es la arquitectura de comunicación. El uso de MQTT, Raspberry Pi y Ubidots demuestra una ruta funcional para enviar datos de campo hacia una plataforma en la nube. Aunque nuestro proyecto plantea el uso del ESP32-S3, SCADA y envío seguro mediante HTTPS, esta tesis sirve como antecedente para justificar que los datos del suelo pueden ser transmitidos, almacenados y visualizados remotamente mediante tecnologías IoT.

El tercer aporte es la importancia del dashboard. La tesis considera la visualización histórica de datos, lo cual es útil para nuestro proyecto porque el sistema no solo debe tomar una lectura puntual, sino también permitir el seguimiento de las condiciones del suelo a lo largo del tiempo. Esto respalda la necesidad de una interfaz local mediante OLED y una posible plataforma remota para visualizar tendencias.

Finalmente, esta tesis aporta una base metodológica para la validación del prototipo, ya que incluye diseño electrónico, configuración de red, pruebas de funcionamiento y comparación con sistemas existentes. Esto puede orientar la etapa de pruebas del proyecto **Creador de hábitats**, especialmente al momento de validar la estabilidad de lectura del sensor de conductividad eléctrica y su integración con el sistema de recomendación de especies.

### Relación específica con Creador de hábitats

Esta tesis se relaciona principalmente con el **módulo electrónico**, el **módulo de comunicación** y el **módulo software** del proyecto. En el módulo electrónico, respalda la selección de sensores de conductividad eléctrica para caracterizar el suelo. En el módulo de comunicación, aporta un antecedente de transmisión de datos mediante tecnologías IoT. En el módulo software, refuerza la importancia de almacenar, visualizar y analizar los datos medidos para tomar decisiones agrícolas.

---

## Tesis 2: Diseño de una plataforma de monitoreo de niveles de CO₂ basada en IoT

### Descripción general

La tesis titulada **“Diseño de una plataforma de monitoreo de niveles de CO₂ basada en IoT”** fue desarrollada en la Universidad Politécnica Salesiana, sede Cuenca, como trabajo de titulación en Ingeniería Electrónica. El trabajo propone una plataforma IoT para medir y monitorear remotamente niveles de CO₂ mediante nodos sensores distribuidos.

El sistema utiliza tecnologías LPWAN, nodos LoRa, LoRaWAN y un servidor ChirpStack para la publicación de datos. Además, desarrolla una aplicación móvil con Flutter para visualizar las mediciones en tiempo real, identificar la ubicación georreferenciada de los nodos y revisar registros históricos. También evalúa sensores de CO₂ como el **MH-Z19B** y el **MG811**, diseñando una placa PCB personalizada y una caja IoT para proteger los componentes electrónicos en exteriores.

### Aportes principales para el proyecto

Esta tesis aporta fundamentos importantes para el proyecto **Creador de hábitats**, especialmente en lo relacionado con el monitoreo de CO₂ y la arquitectura IoT. En nuestro proyecto, el CO₂ del suelo se considera una variable útil para estimar la actividad biológica del suelo, por lo que el uso de un sensor como el **MH-Z19B** resulta coherente con antecedentes de monitoreo ambiental.

El primer aporte es la comparación y selección de sensores de CO₂. La tesis analiza sensores como el MH-Z19B y el MG811, considerando aspectos como precisión, estabilidad, costo, mantenimiento y facilidad de interpretación de datos. Esto es relevante porque nuestro proyecto considera el uso del **MH-Z19B/NDIR** para medir o estimar CO₂ asociado a la respiración del suelo, con la diferencia de que debe protegerse mediante una recubierta o cámara que permita el paso del gas, pero evite el contacto directo con humedad, tierra o partículas.

El segundo aporte es la arquitectura de red de sensores. El uso de nodos distribuidos, comunicación LoRaWAN y ChirpStack demuestra que los sistemas ambientales pueden operar con sensores separados físicamente y transmitir información hacia una plataforma central. Aunque nuestro proyecto puede usar Wi-Fi, HTTPS o SCADA, la tesis sirve como antecedente para justificar la idea de un sistema IoT distribuido y escalable.

El tercer aporte es la integración entre hardware, nube y aplicación de usuario. La tesis no solo mide CO₂, sino que también diseña una plataforma de visualización, almacenamiento y consulta histórica. Esto se relaciona con nuestro proyecto porque el sistema debe entregar información útil al usuario, tanto mediante pantalla OLED como mediante una posible plataforma externa.

El cuarto aporte está vinculado con el diseño físico del prototipo. La tesis implementa una caja IoT para proteger componentes electrónicos y facilitar su uso en exteriores. Esto aporta una referencia para nuestro diseño mecánico, ya que el proyecto **Creador de hábitats** también requiere una carcasa resistente, con espacio para sensores, batería, pantalla, microcontrolador, módulo de energía y salidas hacia sensores de suelo.

### Relación específica con Creador de hábitats

Esta tesis se relaciona principalmente con el **módulo de sensores**, el **módulo de comunicación**, el **módulo de interfaz** y el **módulo mecánico**. En el módulo de sensores, respalda el uso del MH-Z19B para monitoreo de CO₂. En comunicación, aporta una referencia sobre transmisión de datos ambientales hacia plataformas IoT. En interfaz, demuestra la importancia de una visualización clara de los datos. En el módulo mecánico, respalda la necesidad de proteger los componentes electrónicos mediante una carcasa adecuada para exteriores.

---

## Comparación de aportes de ambas tesis

| Tesis | Variable principal | Tecnología destacada | Aporte al proyecto |
|---|---|---|---|
| Diseño de sistema IoT para monitoreo de salinidad del suelo | Conductividad eléctrica / salinidad del suelo | ESP32, MAX485, MQTT, Raspberry Pi, Ubidots | Justifica el monitoreo de CE del suelo y la transmisión de datos hacia una plataforma IoT. |
| Diseño de plataforma de monitoreo de CO₂ basada en IoT | CO₂ ambiental | MH-Z19B, MG811, LoRaWAN, ChirpStack, Flutter | Justifica el uso de sensores de CO₂, nodos IoT, visualización remota y protección física de componentes. |

---

## Aporte conjunto al proyecto Creador de hábitats

Las dos tesis refuerzan la viabilidad técnica del proyecto **Creador de hábitats**, ya que ambas demuestran que es posible integrar sensores ambientales o de suelo con plataformas IoT para obtener datos, procesarlos, transmitirlos y visualizarlos. La primera tesis aporta una base directa para el monitoreo de **conductividad eléctrica del suelo**, una variable clave para evaluar salinidad y compatibilidad suelo-planta. La segunda tesis aporta una base para el monitoreo de **CO₂**, el diseño de nodos sensores, la protección de componentes y la visualización de datos en plataformas digitales.

En conjunto, estos trabajos respaldan la propuesta de un sistema inteligente capaz de medir variables edáficas y ambientales, procesarlas mediante un microcontrolador, mostrarlas localmente en una pantalla OLED y enviarlas hacia un sistema externo para su análisis. Además, sirven como antecedentes para justificar la selección de sensores, la necesidad de calibración, la importancia de la conectividad IoT y el diseño de una carcasa funcional para operación en campo.

---

## Aplicación dentro del informe del proyecto

Estas tesis pueden ser utilizadas en el informe del proyecto dentro de la sección de **antecedentes**, **estado del arte** o **fundamentación técnica**. Su función es demostrar que existen trabajos previos relacionados con monitoreo de suelo, CO₂, salinidad, plataformas IoT, dashboards y sistemas de adquisición de datos. Además, ayudan a justificar que el proyecto **Creador de hábitats** no parte de una idea aislada, sino que integra y adapta principios ya aplicados en investigaciones previas, orientándolos hacia un sistema de recomendación de especies para reforestación urbana en suelos de baja fertilidad.

