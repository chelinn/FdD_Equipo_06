
---
# Actividad 1 Ploteo de mensaje en LCD 2x16 a través de Bluetooth y del MIT App Inventor

Objetivo: Diseñar e implementar una aplicación en MIT Inventor y un programa para ESP32, tal que a través de Bluetooth se logre enviar un mensaje desde la APP a un LCD 2x16 conectado a un ESP32
Materiales
- Módulo ESP32 DevKit V1 
- LCD 2x161 
- Cable micro-USB1 Smartphone Android

## Código del ESP32

``` c++

#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <BluetoothSerial.h>

BluetoothSerial BT;

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {

  Serial.begin(115200);

  Wire.begin(21, 22);

  lcd.init();
  lcd.backlight();

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Grupo 6 GG");

  BT.begin("ESP32_LCD");

  Serial.println("Bluetooth iniciado");
}


void loop() {

  if (BT.available()) {

    String mensaje = BT.readString();
    mensaje.trim();

    Serial.print("Recibido: ");
    Serial.println(mensaje);

    lcd.clear();

    lcd.setCursor(0, 0);
    lcd.print("Mensaje:");

    lcd.setCursor(0, 1);
    lcd.print(mensaje);

  }
}
```
## Explicación código del ESP32 

Este programa hace que el ESP32 reciba mensajes por Bluetooth y los muestre en una pantalla LCD.

- Primero se incluyen las librerías para usar la pantalla (I2C) y el Bluetooth.
- En el `setup()` se prepara todo: se enciende la pantalla, se le pone un mensaje de bienvenida "Grupo 6 GG" y se activa el Bluetooth con el nombre "ESP32_LCD".
- En el `loop()`, el programa está siempre revisando si llegó algo por Bluetooth.
- Si llega un mensaje, lo limpia de espacios raros, lo muestra en el monitor serie y lo escribe en la pantalla LCD, debajo de la palabra "Mensaje:".

## Código de bloques 

![alt text](lcd.png)


![alt text](bloques_lcd.png)

![alt text](app_lcd.png)



## Explicación de los Bloques de App Inventor

- **`BeforePicking`**: llena la lista con los dispositivos Bluetooth disponibles.
- **`AfterPicking`**: intenta conectarse al dispositivo elegido y avisa si conectó o no.
- **`BtnEnviar.Click`**: si está conectado, envía el texto escrito (ahora desde la caja por Bluetooth.


---
# Actividad 2: Control de ángulo con Bluetooth y/o WiFi con el MIT App Inventor 

Objetivo: Diseñar e implementar una aplicación en MIT Inventor y un programa para ESP32, tal que a través de Bluetooth/WiFi se logre controlar el ángulo de giro del servomotor con una barra deslizable (SLIDER) desde la APP hacia el servomotor conectado al ESP32.
Materiales:
- Módulo ESP32 DevKit V1
- Servomotor 35G-CM 270°
- Cable micro-US

## Código ESP32

```c++

#include <BluetoothSerial.h>
#include <ESP32Servo.h>

BluetoothSerial SerialBT;
Servo servo1;

void setup() {

  Serial.begin(115200);

  SerialBT.begin("ESP32_SERVO");

  servo1.attach(18);   
  servo1.write(90);    
}

void loop() {

  if (SerialBT.available()) {

    String dato = SerialBT.readString();

    int angulo = dato.toInt();

    if (angulo >= 0 && angulo <= 270) {

      servo1.write(angulo);

      Serial.print("Angulo recibido: ");
      Serial.println(angulo);
    }
  }
}

```

## Explicación código del ESP32 

- Se incluyen las librerías de Bluetooth y de servo.
- En el `setup()`: se activa el Bluetooth con el nombre "ESP32_SERVO", se conecta el servo al pin 18 y se pone en 90° de inicio.
- En el `loop()`: si llega un dato por Bluetooth, lo convierte a número.
- Si ese número está entre 0 y 270, mueve el servo a ese ángulo y lo muestra en el monitor serie.


## Códico de bloques
![alt text](servo2.png)

![alt text](bloques_servo2.png)

![alt text](app_servo2.1.png)


## Bloques de App Inventor

- **`BeforePicking`**: llena la lista con los dispositivos Bluetooth disponibles.
- **`AfterPicking`**: se conecta al dispositivo elegido y avisa si conectó o no.
- **`mover_servo.PositionChanged`**: este bloque se activa solo, cada vez que el usuario mueve el slider llamado `mover_servo`. Si está conectado por Bluetooth, envía automáticamente la posición del slider (`thumbPosition`) al ESP32.

