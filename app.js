const express = require("express");
const mqtt = require("mqtt");
const path = require("path");

const app = express();
const port = 5000;
const host = "127.0.0.1";

// Objek buat nyimpen semua data sensor
let sensorData = {};
let lastReceivedTime = {};

// MQTT broker config
const options = {
  host: "e7f3b9b0f9454fda937c059e7bb8363a.s1.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "hydroponic_dashboard",
  password: "bombomBASS123",
};

// Koneksi ke broker
const mqttClient = mqtt.connect(options);

// List topik sensor
const topics = [
  "iot/hydroponic/01/sensors",
  "iot/hydroponic/02/sensors"
];

// Subscribe ke semua topik
mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe(topics);
  topics.forEach((topic) => {
    console.log("Subscribed to: ", topic);
  });
});

// Handle pesan
mqttClient.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    // Ambil device id dari topic: sensor_1, sensor_2, dll
    const parts = topic.split("/");
    const deviceId = "sensor_" + parts[2];

    // Simpan datanya
    sensorData[deviceId] = data;
    lastReceivedTime[deviceId] = Date.now();

    // console.log(`Data dari ${deviceId}:`, data);
    console.log(sensorData);
  } catch (err) {
    console.log("Error parsing message:", err);
  }
});

// Serve static file
app.use(express.static(path.join(__dirname, "public")));

// API endpoint
app.get("/api/sensors", (req, res) => {
  res.json(sensorData);
});

// Dashboard page
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://${host}:${port}`);
});

// Cek setiap 5 detik
setInterval(() => {
  const now = Date.now();
  const timeout = 5 * 1000; // 10 detik

  for (const deviceId in lastReceivedTime) {
    if (now - lastReceivedTime[deviceId] > timeout) {
      console.log(`Data from ${deviceId} timeout, reset...`);
      delete sensorData[deviceId];
      delete lastReceivedTime[deviceId];
    }
  }
}, 5000);
