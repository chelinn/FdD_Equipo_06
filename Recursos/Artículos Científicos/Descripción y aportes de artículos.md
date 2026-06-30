# Descripción y aportes de artículos

## Propósito del documento

Este documento resume los aportes de los artículos científicos revisados para el desarrollo del proyecto **Creador de hábitats**, un sistema inteligente orientado al análisis de condiciones del suelo y del ambiente para recomendar especies vegetales compatibles en procesos de reforestación urbana. Los artículos seleccionados aportan fundamentos técnicos para la medición de humedad del suelo, la caracterización de textura y la toma de decisiones basada en datos.

---

## Artículo 1: *Medición de humedad en suelos: Revisión de métodos y características*

### Descripción general

El primer artículo realiza una revisión de métodos e instrumentos utilizados para medir la humedad del suelo, con énfasis en técnicas basadas en propiedades eléctricas. El texto explica que la humedad es un factor determinante en la fertilidad del suelo, en el desarrollo vegetal, en la disponibilidad de agua para procesos biológicos y en la regulación de la temperatura del suelo. Además, señala que las técnicas de medición de humedad basadas en propiedades eléctricas pueden adaptarse a sistemas automatizados y remotos, aunque requieren mantenimiento y calibración.

El artículo también describe cómo la composición del suelo influye en la retención de agua. Los suelos arenosos presentan baja retención, mientras que los limos y arcillas retienen mayor humedad debido a su estructura y a las fuerzas fisicoquímicas que actúan sobre las moléculas de agua. Asimismo, diferencia tipos de humedad como la gravitacional, capilar e higroscópica, lo cual es importante para interpretar correctamente la disponibilidad real de agua para las plantas.

### Aportes al proyecto

Este artículo aporta una base científica para justificar la inclusión de la **humedad del suelo** como una variable principal del sistema. En el proyecto, la humedad del suelo será medida mediante un sensor capacitivo y utilizada dentro del cálculo del índice de compatibilidad de hábitat. La revisión respalda esta decisión porque demuestra que la humedad influye directamente en la fertilidad, la disponibilidad de agua, el desarrollo vegetal y las propiedades físicas del suelo.

Otro aporte importante es la justificación de usar sensores que puedan automatizarse y conectarse a sistemas remotos. Esto se relaciona directamente con el uso del **ESP32-S3**, el envío de datos a la nube y la visualización local mediante pantalla OLED. El artículo indica que los instrumentos eléctricos de medición de humedad son apropiados para automatización y monitoreo remoto, lo cual coincide con la arquitectura del proyecto.

También permite justificar la necesidad de **calibración del sensor de humedad**. El artículo menciona que los sensores eléctricos requieren calibración y mantenimiento para mejorar la precisión. Esto se vincula con el índice de confiabilidad sensorial del proyecto, ya que las mediciones obtenidas por sensores deben compararse con valores de referencia o métodos de laboratorio.

Además, el artículo ayuda a sustentar por qué se prefiere un **sensor capacitivo** frente a sensores resistivos simples. Los sensores resistivos pueden presentar desviaciones por polarización de electrodos, influencia de sales, necesidad de limpieza y problemas en mediciones prolongadas. Por ello, el sensor capacitivo resulta más adecuado para una versión funcional del prototipo, especialmente si se busca mayor durabilidad en contacto con el suelo.

Finalmente, el artículo aporta fundamentos para interpretar la humedad del suelo dentro del modelo matemático. Conceptos como capacidad de campo, punto de marchitez y disponibilidad de agua para las plantas ayudan a justificar el uso de rangos y funciones de normalización en el cálculo de compatibilidad suelo-planta.

### Aplicación directa en el proyecto

- Justifica la medición de humedad del suelo como variable crítica del sistema.
- Respalda el uso de sensores automatizables para monitoreo remoto.
- Refuerza la necesidad de calibrar el sensor capacitivo de humedad.
- Ayuda a explicar por qué se evita depender de sensores resistivos simples para una solución final.
- Contribuye al diseño del índice de compatibilidad, especialmente en la normalización de humedad del suelo.
- Aporta argumentos para el índice de confiabilidad sensorial, al destacar que los sensores requieren validación y mantenimiento.

---

## Artículo 2: *Soil texture analysis using controlled image processing*

### Descripción general

El segundo artículo propone un método para analizar la textura del suelo mediante procesamiento de imágenes en un entorno controlado. El trabajo plantea el uso de una máquina tipo **Blackbox** para capturar imágenes bajo condiciones estables de iluminación, distancia y sequedad de la muestra. A partir de estas imágenes, se entrenan modelos de aprendizaje profundo, específicamente variantes de YOLOv8, para clasificar la textura del suelo según clases relacionadas con el triángulo textural USDA.

El artículo resalta que los métodos tradicionales de análisis de textura pueden ser costosos, lentos y dependientes de personal especializado. Como alternativa, el procesamiento de imágenes en un ambiente controlado permite reducir el tiempo de análisis y automatizar la clasificación. El estudio reporta una precisión máxima de 99.5 % en la clasificación de textura para las muestras evaluadas.

También presenta una metodología ordenada que incluye recolección de muestras, validación de laboratorio, preparación de muestras, captura de imágenes en caja negra, preprocesamiento, anotación, entrenamiento de modelos y validación con resultados de laboratorio. Esta secuencia es útil como referencia metodológica para proyectos que buscan combinar sensores, software y validación experimental.

### Aportes al proyecto

Este artículo aporta fundamentos para reforzar la importancia de la **textura del suelo** en la recomendación de especies vegetales. La textura está relacionada con la proporción de arena, limo y arcilla, y condiciona propiedades como retención de agua, aireación, drenaje y disponibilidad de nutrientes. Por ello, su incorporación en el sistema de recomendación permite mejorar la compatibilidad entre suelo y especie.

El artículo también respalda la idea de utilizar tecnologías digitales para reducir la dependencia de análisis tradicionales de laboratorio. Aunque el proyecto actual considera obtener la textura mediante una API de suelo y, de forma alternativa, mediante una matriz auxiliar basada en color Munsell, este artículo demuestra que una línea futura del proyecto podría incorporar análisis de textura por imagen.

Otro aporte relevante está relacionado con el **diseño mecánico**. El uso de una caja negra con iluminación controlada y distancia fija demuestra la importancia de controlar las condiciones externas cuando se desea obtener datos confiables. Esta idea puede inspirar futuras mejoras del proyecto, como una cámara o módulo auxiliar para analizar muestras de suelo en condiciones controladas.

Asimismo, el artículo aporta un criterio para la versión avanzada del proyecto: el uso de Machine Learning o procesamiento de imágenes puede mejorar la capacidad predictiva del sistema, pero también aumenta la complejidad, el costo computacional y la necesidad de una base de datos amplia. Esto ayuda a justificar por qué la solución principal del proyecto utiliza un modelo matemático explicable, dejando el aprendizaje automático como una posible evolución futura.

### Aplicación directa en el proyecto

- Justifica la importancia de la textura del suelo en la recomendación de especies.
- Respalda la relación entre textura, selección de plantas y manejo del suelo.
- Sirve como referencia para una posible mejora futura basada en visión artificial.
- Aporta ideas para el diseño de una cámara o módulo de muestra con iluminación controlada.
- Refuerza la necesidad de validar resultados digitales con métodos de laboratorio.
- Permite justificar por qué el Machine Learning puede considerarse en una versión avanzada, pero no necesariamente en la primera versión funcional.

---

## Relación de los artículos con el sistema Creador de hábitats

Los dos artículos se complementan dentro del proyecto. El primero fortalece el fundamento del **módulo de sensores**, especialmente en la medición de humedad del suelo y en la necesidad de calibración. El segundo fortalece el fundamento del **módulo de software y caracterización del suelo**, especialmente en la textura y en el uso de tecnologías digitales para clasificar muestras.

En conjunto, ambos artículos ayudan a justificar que el sistema no debe limitarse a recolectar datos, sino que debe transformarlos en información útil para recomendar especies. La humedad del suelo permite evaluar la disponibilidad de agua, mientras que la textura permite interpretar la capacidad del suelo para retener humedad, sostener raíces y favorecer el desarrollo vegetal. Estas variables son fundamentales para el cálculo de compatibilidad entre suelo y planta.

---

## Aportes por módulo del proyecto

| Módulo del proyecto | Aporte de los artículos |
|---|---|
| Módulo de sensores | Sustentan la medición de humedad del suelo, temperatura, conductividad y variables relacionadas con la calidad del suelo. |
| Módulo de software | Respaldan el uso de modelos matemáticos, clasificación de datos y posible uso futuro de procesamiento de imágenes o Machine Learning. |
| Módulo mecánico | Inspiran el diseño de una carcasa o cámara protegida, especialmente cuando se requiere estabilidad ambiental o protección de sensores. |
| Módulo de validación | Refuerzan la necesidad de calibración, comparación con métodos de laboratorio y verificación de resultados. |
| Módulo de recomendación | Ayudan a justificar que la selección de especies debe basarse en variables del suelo como humedad y textura. |

---

## Conclusión

Los artículos revisados aportan fundamentos técnicos importantes para el proyecto **Creador de hábitats**. El primer artículo justifica la medición de humedad del suelo mediante sensores automatizables, la necesidad de calibración y la importancia del contenido de agua para el desarrollo vegetal. El segundo artículo resalta la importancia de la textura del suelo y demuestra que el análisis digital en condiciones controladas puede apoyar la clasificación de suelos y la recomendación agrícola.

Estos aportes permiten fortalecer la justificación del sistema propuesto, ya que el proyecto integra sensores, procesamiento de datos, validación y recomendación de especies. Además, los artículos ayudan a diferenciar entre una primera versión funcional basada en sensores y modelo matemático, y una posible versión futura con visión artificial o aprendizaje automático.

---

## Referencias utilizadas

1. Caicedo-Rosero, L. C., Méndez-Ávila, F. J., Gutiérrez-Zeferino, E., & Flores-Cuautle, J. J. A. (2021). *Medición de humedad en suelos: Revisión de métodos y características*. Publicación Semestral Pädi, 9(17), 1–8.
2. Sattar, K., Maqsood, U., Hussain, Q., Majeed, S., Kaleem, S., Babar, M., & Qureshi, B. (2024). *Soil texture analysis using controlled image processing*. Smart Agricultural Technology, 9, 100588.
