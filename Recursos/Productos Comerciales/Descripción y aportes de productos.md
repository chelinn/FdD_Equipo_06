# Descripción y aportes de productos

## Introducción

El análisis de productos comerciales permite identificar soluciones existentes relacionadas con el monitoreo agrícola, la medición de parámetros del suelo, la conectividad IoT, la protección mecánica y la gestión de datos en tiempo real. Para el proyecto **Creador de hábitats**, estos productos sirven como referencia tecnológica para justificar decisiones de diseño, comparar prestaciones y reconocer oportunidades de mejora en el prototipo propuesto.

Los productos revisados son:

1. **Teralytic – Sonda de suelo**.
2. **SMELPRO – Agricultura inteligente**.

---

## Producto 1: Teralytic – Sonda de suelo

### Descripción del producto

El producto Teralytic corresponde a una **sonda de suelo** diseñada para obtener datos del suelo en tiempo real y apoyar la toma de decisiones en actividades agrícolas. Según el brochure, la sonda mide principalmente **humedad del suelo**, **temperatura del suelo** y **conductividad eléctrica**, variables que permiten evaluar el estado físico y químico del suelo. El producto está orientado a aplicaciones como agricultura de precisión, manejo de riego, invernaderos, viveros, investigación, educación, césped y paisajismo.

El brochure resalta que la sonda es precisa, conectada, durable y capaz de entregar información en tiempo real. También indica que puede integrarse con un registrador de datos y un portal de monitoreo para analizar información histórica. En sus especificaciones técnicas se menciona un rango de humedad de **0 a 100 % VWC**, rango de temperatura de **-20 a 60 °C**, rango de conductividad eléctrica de **0 a 20 mS/cm**, alimentación de **3.6 a 15 V DC**, comunicación **SDI-12 / Modbus**, protección **IP68** y longitud estándar de **57 cm**.

### Aportes al proyecto

Este producto aporta una referencia directa para el diseño del módulo de sensores del proyecto, ya que mide variables similares a las consideradas en el sistema Creador de hábitats. La medición de humedad, temperatura del suelo y conductividad eléctrica coincide con los parámetros necesarios para evaluar la compatibilidad suelo-planta y calcular indicadores de adaptabilidad.

También aporta una referencia sobre la importancia de la **robustez física** de los sensores de campo. La protección IP68 y el diseño para condiciones reales de campo refuerzan la necesidad de que los sensores del proyecto estén protegidos contra humedad, polvo, golpes y contacto prolongado con el suelo. Esto es importante porque el prototipo no debe limitarse a funcionar en laboratorio, sino que debe aproximarse a condiciones reales de uso en zonas urbanas o periurbanas.

Otro aporte importante es el uso de protocolos de comunicación como **SDI-12 y Modbus**, lo cual respalda la selección de sensores industriales o semindustriales con comunicación digital confiable. En el proyecto, esto se relaciona con la elección del sensor de conductividad eléctrica mediante **MODBUS-RTU RS485 Soil EC**, ya que permite una comunicación más robusta que una lectura analógica simple.

### Relación con el proyecto Creador de hábitats

El producto Teralytic sirve como referencia para justificar que el sistema debe medir variables edáficas clave y no limitarse a una sola medición. En particular, fortalece la decisión de integrar sensores de humedad del suelo, temperatura del suelo y conductividad eléctrica. Además, permite comparar el prototipo con una solución comercial ya orientada al campo, lo que ayuda a identificar mejoras futuras como mayor protección mecánica, calibración más rigurosa, integración con registrador de datos y monitoreo histórico.

---

## Producto 2: SMELPRO – Agricultura inteligente

### Descripción del producto

El producto SMELPRO corresponde a una solución de **agricultura inteligente** basada en sensores, conectividad, software y monitoreo remoto. El brochure indica que la solución integra sensores, conectividad y plataforma en la nube para ofrecer información en tiempo real sobre condiciones del cultivo, suelo y clima. Su propósito principal es ayudar a optimizar el uso de agua y fertilizantes, aumentar la productividad, reducir costos y tomar decisiones basadas en datos reales.

Entre sus sensores inteligentes se mencionan variables como **humedad del suelo**, **temperatura ambiental**, **humedad relativa**, **radiación solar** y **precipitación**. En conectividad, el producto considera transmisión de datos por **4G/LTE**, comunicación estable y segura, bajo consumo energético e integración con la nube. La plataforma en la nube permite monitoreo en tiempo real, tableros personalizables, alertas, notificaciones, historial de datos y reportes. Además, el sistema incluye control inteligente para automatización de riego, activación de equipos remotos y programación de eventos.

El equipo destacado se presenta como una estación de monitoreo solar todo en uno para campo, con energía solar autónoma, instalación rápida, diseño robusto para exteriores, protección **IP65** e idoneidad para distintos terrenos.

### Aportes al proyecto

Este producto aporta una visión más integral del sistema, ya que no se limita únicamente a medir variables del suelo, sino que incorpora sensores ambientales, conectividad, nube, alertas y posibilidad de control remoto. Esto se relaciona directamente con el enfoque del proyecto Creador de hábitats, que busca recopilar datos edáficos y ambientales para generar recomendaciones de especies vegetales en procesos de reforestación.

El producto respalda la necesidad de diseñar una arquitectura con **módulo de sensores**, **módulo de energía**, **módulo de comunicación** y **módulo de visualización o plataforma externa**. Además, refuerza la importancia de la alimentación solar como alternativa para operación en campo, especialmente en zonas áridas o con acceso limitado a energía eléctrica.

También aporta referencias sobre conectividad IoT. El uso de transmisión 4G/LTE y plataforma en la nube demuestra que las soluciones agrícolas modernas requieren acceso remoto a los datos, almacenamiento histórico, alertas y tableros de monitoreo. En el proyecto, esto se relaciona con el envío de datos mediante HTTPS, la posible conexión a un sistema SCADA y la futura implementación de un dashboard o base de datos.

### Relación con el proyecto Creador de hábitats

SMELPRO sirve como referencia para justificar que el proyecto debe funcionar como un sistema completo y no como un conjunto aislado de sensores. Sus características ayudan a sustentar la incorporación de energía solar, comunicación con la nube, monitoreo remoto, plataforma de datos y protección mecánica para exteriores. Además, permite identificar mejoras futuras como alertas automáticas, reportes históricos, control de riego o recomendaciones más avanzadas basadas en datos acumulados.

---

## Comparación de aportes de los productos

| Aspecto evaluado | Teralytic – Sonda de suelo | SMELPRO – Agricultura inteligente | Aporte al proyecto |
|---|---|---|---|
| Enfoque principal | Medición directa de parámetros del suelo | Sistema integral IoT agrícola | Combinar medición edáfica con arquitectura IoT |
| Variables medidas | Humedad, temperatura del suelo y conductividad eléctrica | Humedad del suelo, temperatura ambiental, humedad relativa, radiación solar y precipitación | Selección de variables relevantes para compatibilidad suelo-planta |
| Comunicación | SDI-12 / Modbus | 4G/LTE e integración con nube | Justifica comunicación robusta y envío de datos remotos |
| Protección | IP68 | IP65 | Refuerza la necesidad de carcasa y sensores protegidos |
| Energía | Alimentación DC | Estación con energía solar autónoma | Sustenta el uso de panel solar y batería |
| Gestión de datos | Registrador y portal de monitoreo | Plataforma en nube, alertas, historial y reportes | Apoya la idea de SCADA, nube y base de datos |
| Aplicación | Agricultura, riego, investigación y viveros | Agricultura extensiva, invernaderos, riego tecnificado y estaciones meteorológicas | Relaciona el proyecto con reforestación urbana y monitoreo ambiental |

---

## Aportes generales al diseño del proyecto

Los productos analizados aportan referencias importantes para el desarrollo del sistema Creador de hábitats. En primer lugar, confirman que las variables de humedad del suelo, temperatura del suelo, conductividad eléctrica y condiciones ambientales son relevantes para tomar decisiones en sistemas agrícolas y ambientales. En segundo lugar, muestran que un producto de campo debe incorporar protección física, alimentación estable, conectividad y visualización de datos. En tercer lugar, evidencian que las soluciones actuales tienden a usar plataformas en la nube, dashboards, alertas y registros históricos para mejorar la toma de decisiones.

A partir de estos productos, el proyecto puede justificar la integración de sensores, el uso de comunicación segura, el diseño de una carcasa robusta, la incorporación de energía solar y la necesidad de mostrar o almacenar información para análisis posterior. Sin embargo, el proyecto Creador de hábitats se diferencia porque no solo busca monitorear el suelo, sino también **recomendar especies vegetales compatibles** con las condiciones edáficas y ambientales, orientándose a la reforestación urbana y periurbana en zonas áridas de Lima Metropolitana.

---

## Conclusión

El análisis de los productos Teralytic y SMELPRO permite fortalecer la fundamentación técnica del proyecto. Teralytic aporta una referencia específica sobre medición multiparámetro del suelo con sensores robustos y comunicación industrial, mientras que SMELPRO aporta una referencia de sistema IoT integral con energía solar, nube, sensores ambientales y monitoreo remoto. Ambos productos demuestran que el monitoreo inteligente del suelo y del ambiente es una tendencia relevante para la agricultura de precisión y la gestión sostenible de recursos.

Para el proyecto Creador de hábitats, estos productos sirven como antecedentes comerciales que respaldan la selección de sensores, la estructura modular, la conectividad IoT, la protección mecánica y la gestión de datos. Además, permiten destacar el valor diferencial del proyecto: utilizar la información recolectada no solo para monitorear, sino para evaluar compatibilidad suelo-planta y recomendar especies adecuadas para procesos de reforestación urbana en zonas áridas.
