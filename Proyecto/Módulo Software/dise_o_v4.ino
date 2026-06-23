#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include <DHT.h>
#include <TinyGPS++.h>

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#include <OneWire.h>
#include <DallasTemperature.h>

// ======================
// OLED
// ======================

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  &Wire,
  -1
);

// ======================
// DHT22
// ======================

#define DHTPIN 4
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

// ======================
// SENSOR SUELO
// ======================

#define SOIL_PIN 34

const int sueloSeco = 3200;
const int sueloMojado = 1200;

// ======================
// GPS
// ======================

TinyGPSPlus gps;
HardwareSerial GPS(2);

#define GPS_RX 16
#define GPS_TX 17

// ======================
// TEMPERATURA SUELO
// ======================

#define SOIL_TEMP_PIN 18

OneWire oneWire(SOIL_TEMP_PIN);

DallasTemperature soilTemp(&oneWire);

// ======================
// BLE
// ======================

#define SERVICE_UUID        "12345678-1234-1234-1234-123456789abc"
#define CHARACTERISTIC_UUID "abcdefab-1234-5678-1234-abcdefabcdef"

BLECharacteristic *pCharacteristic;

bool deviceConnected = false;

bool mostrarConexion = false;

unsigned long tiempoConexion = 0;

// ======================

class MyServerCallbacks : public BLEServerCallbacks
{
  void onConnect(BLEServer* pServer)
  {
    deviceConnected = true;

    mostrarConexion = true;

    tiempoConexion = millis();

    Serial.println("Cliente BLE conectado");
  }

  void onDisconnect(BLEServer* pServer)
  {
    deviceConnected = false;

    Serial.println("Cliente BLE desconectado");

    BLEDevice::startAdvertising();
  }
};

// ======================

unsigned long oledTimer = 0;
bool mostrarGPS = false;

// ======================

void setup()
{
  Serial.begin(115200);

  // OLED

  Wire.begin(21, 22);

  if (!display.begin(
        SSD1306_SWITCHCAPVCC,
        0x3C))
  {
    Serial.println("Error OLED");

    while (true);
  }

  display.clearDisplay();
  display.display();

  // DHT

  dht.begin();

  // GPS

  GPS.begin(
    9600,
    SERIAL_8N1,
    GPS_RX,
    GPS_TX
  );

  // temperatura de suelo

  soilTemp.begin();

  // BLE

  BLEDevice::init(
    "REFORESTANDO_ESP32"
  );

  BLEServer *pServer =
    BLEDevice::createServer();

  pServer->setCallbacks(
    new MyServerCallbacks()
  );

  BLEService *pService =
    pServer->createService(
      SERVICE_UUID
    );

  pCharacteristic =
    pService->createCharacteristic(
      CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_NOTIFY
    );

  pCharacteristic->addDescriptor(
    new BLE2902()
  );

  pService->start();

  BLEAdvertising *pAdvertising =
    BLEDevice::getAdvertising();

  pAdvertising->start();

  Serial.println();
  Serial.println("========================");
  Serial.println("REFORESTANDO");
  Serial.println("BLE INICIADO");
  Serial.println("========================");
}

// ======================

void loop()
{
  while (GPS.available())
  {
    gps.encode(
      GPS.read()
    );
  }

  float temperatura =
    dht.readTemperature();

  float humedadAire =
    dht.readHumidity();
  
  soilTemp.requestTemperatures();

  float temperaturaSuelo =
    soilTemp.getTempCByIndex(0);

  int adc =
    analogRead(SOIL_PIN);

  int humedadSuelo =
    map(
      adc,
      sueloSeco,
      sueloMojado,
      0,
      100
    );

  humedadSuelo =
    constrain(
      humedadSuelo,
      0,
      100
    );

  double latitud = 0;
  double longitud = 0;
  int satelites = 0;

  if (gps.location.isValid())
  {
    latitud =
      gps.location.lat();

    longitud =
      gps.location.lng();

    satelites =
      gps.satellites.value();
  }

  // ======================
  // SERIAL
  // ======================

  Serial.println();
  Serial.println("===== DATOS =====");

  Serial.print("Temp: ");
  Serial.println(temperatura);

  Serial.print("Hum Aire: ");
  Serial.println(humedadAire);

  Serial.print("Hum Suelo: ");
  Serial.print(humedadSuelo);
  Serial.println("%");

  Serial.print("Temp Suelo: ");
  Serial.print(temperaturaSuelo);
  Serial.println(" C");

  Serial.print("Lat: ");
  Serial.println(latitud, 6);

  Serial.print("Lon: ");
  Serial.println(longitud, 6);

  Serial.print("Sat: ");
  Serial.println(satelites);

  // ======================
  // MENSAJE CONEXION BLE
  // ======================

  if (mostrarConexion)
  {
    display.clearDisplay();

    display.setTextSize(1);
    display.setTextColor(WHITE);

    display.setCursor(15, 5);
    display.println("REFORESTANDO");

    display.setCursor(10, 25);
    display.println("DISPOSITIVO");

    display.setCursor(15, 38);
    display.println("CONECTADO");

    display.setCursor(0, 54);
    display.println("ENVIANDO DATOS");

    display.display();

    if (millis() - tiempoConexion > 3000)
    {
      mostrarConexion = false;
    }

    return;
  }

  // ======================
  // CAMBIO DE PANTALLA
  // ======================

  if (millis() - oledTimer > 5000)
  {
    oledTimer = millis();

    mostrarGPS = !mostrarGPS;
  }

  display.clearDisplay();

  display.setTextSize(1);
  display.setTextColor(WHITE);

  if (!mostrarGPS)
  {
    display.setCursor(0, 0);
    display.println("REFORESTANDO");

    display.setCursor(0, 15);
    display.print("Temp:");
    display.print(temperatura, 1);
    display.println(" C");

    display.setCursor(0, 28);
    display.print("Hum:");
    display.print(humedadAire, 0);
    display.println("%");

    display.setCursor(0, 41);
    display.print("Suelo:");
    display.print(humedadSuelo);
    display.println("%");

    display.setCursor(0, 41);
    display.print("HS:");
    display.print(humedadSuelo);
    display.println("%");

    display.setCursor(0, 54);
    display.print("TS:");
    display.print(temperaturaSuelo, 1);
    display.println("C");

    display.setCursor(0, 54);

    if (deviceConnected)
    {
      display.println("BLE: Conectado");
    }
    else
    {
      display.println("BLE: Esperando");
    }
  }
  else
  {
    display.setCursor(0, 0);
    display.println("GPS");

    if (satelites > 0)
    {
      display.setCursor(0, 18);
      display.print("SAT: ");
      display.println(satelites);

      display.setCursor(0, 34);
      display.print("LAT:");
      display.println(latitud, 2);

      display.setCursor(0, 50);
      display.print("LON:");
      display.println(longitud, 2);
    }
    else
    {
      display.setCursor(0, 25);
      display.println("Esperando");

      display.setCursor(0, 40);
      display.println("satelites...");
    }
  }

  display.display();

  // ======================
  // BLE JSON
  // ======================

  String json = "{";

  json += "\"temperatura_aire\":";
  json += String(temperatura, 1);

  json += ",\"humedad_aire\":";
  json += String(humedadAire, 1);

  json += ",\"humedad_suelo\":";
  json += String(humedadSuelo);

  json += ",\"temperatura_suelo\":";
  json += String(temperaturaSuelo, 1);

  json += ",\"latitud\":";
  json += String(latitud, 6);

  json += ",\"longitud\":";
  json += String(longitud, 6);

  json += ",\"satelites\":";
  json += String(satelites);

  json += "}";

  if (deviceConnected)
  {
    pCharacteristic->setValue(
      json.c_str()
    );

    pCharacteristic->notify();

    Serial.println("Enviando BLE:");
    Serial.println(json);
  }

  delay(2000);
}