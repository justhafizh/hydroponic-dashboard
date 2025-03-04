const express = require('express');
const mqtt = require('mqtt');
const path = require('path');

const app = express();
//const port = 3000;
const port = 5000;

// Data untuk menyimpan nilai dari 6 sensor dan timestamp masing-masing
let sensorData = {
  waterTemp: { value: null, timestamp: 0 },
  humidity: { value: null, timestamp: 0 },
  temperature: { value: null, timestamp: 0 },
  waterLevel: { value: null, timestamp: 0 },
  phLevel: { value: null, timestamp: 0 },
  nutrient: { value: null, timestamp: 0 },
};

const options = {
  host: 'e7f3b9b0f9454fda937c059e7bb8363a.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'justhafizh_',
  password: 'BiarkanDuniaT4u',
};

const mqttClient = mqtt.connect(options);

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
  const timestamp = Date.now(); // Waktu saat data diterima

  switch (topic) {
    case 'sensor/waterTemp':
      sensorData.waterTemp = { value: data, timestamp };
      break;
    case 'sensor/humidity':
      sensorData.humidity = { value: data, timestamp };
      break;
    case 'sensor/temperature':
      sensorData.temperature = { value: data, timestamp };
      break;
    case 'sensor/waterLevel':
      sensorData.waterLevel = { value: data, timestamp };
      break;
    case 'sensor/phLevel':
      sensorData.phLevel = { value: data, timestamp };
      break;
    case 'sensor/nutrient':
      sensorData.nutrient = { value: data, timestamp };
      break;
    default:
      console.log(`No handler for topic ${topic}`);
  }
  console.log(`Received message from ${topic}: ${data}`);
});

// Fungsi untuk menghapus data yang lebih lama dari 3 detik
function clearOldData() {
  const now = Date.now();
  Object.keys(sensorData).forEach((key) => {
    if (now - sensorData[key].timestamp > 3000) {
      sensorData[key].value = null; // Hapus data jika lebih dari 3 detik
    }
  });
}

// Melayani file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Membuat API untuk mendapatkan data sensor
app.get('/api/sensors', (req, res) => {
  clearOldData(); // Bersihkan data lama sebelum mengirimkan respon
  const responseData = {};
  Object.keys(sensorData).forEach((key) => {
    responseData[key] = sensorData[key].value; // Hanya kirim nilai
  });
  res.json(responseData);
});

// Membuat halaman dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/indexx.html'));
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running at http://10.148.0.5:${port}`);
  console.log(`Server running at http://localhost:${port}`);
});
