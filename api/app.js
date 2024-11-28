const express = require('express');
const mqtt = require('mqtt');
const path = require('path');

const app = express();
const port = 3000;

// Data untuk menyimpan nilai dari 6 sensor
let sensorData = {
  waterTemp: null,
  humidity: null,
  temperature: null,
  waterLevel: null,
  phLevel: null,
  nutrient: null,
};
var options = {
  host: 'e7f3b9b0f9454fda937c059e7bb8363a.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'justhafizh_',
  password: 'BiarkanDuniaT4u'
}

var mqttClient = mqtt.connect(options);

// Langganan ke topik sensor
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');

  mqttClient.subscribe('sensor/waterTemp');
  mqttClient.subscribe('sensor/humidity');
  mqttClient.subscribe('sensor/temperature');
  mqttClient.subscribe('sensor/waterLevel');
  mqttClient.subscribe('sensor/phLevel');
  mqttClient.subscribe('sensor/nutrient');

  console.log('Subscribed to all sensor topics');
});

mqttClient.on('error', function (error) {
  console.log(error);
});

mqttClient.on('message', (topic, message) => {
  const data = message.toString();

  switch (topic) {
    case 'sensor/waterTemp': 
      sensorData.waterTemp = data;
      break;
    case 'sensor/humidity':
      sensorData.humidity = data;
      break;
    case 'sensor/temperature':
      sensorData.temperature= data;
      break;
    case 'sensor/waterLevel':
      sensorData.waterLevel = data;
      break;
    case 'sensor/phLevel':
      sensorData.phLevel = data;
      break;
    case 'sensor/nutrient':
      sensorData.nutrient = data;
      break;
    default:
      console.log(`No handler for topic ${topic}`);
  }
  console.log(`Received message from ${topic}: ${data}`);
});

// Melayani file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Membuat API untuk mendapatkan data sensor
app.get('/api/sensors', (req, res) => {
  res.json(sensorData);
});

// Membuat halaman indexx
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/indexx.html'));
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


