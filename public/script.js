// Initialize Feather Icons
feather.replace();
// Ambil data dari server
let lastUpdate = {
  waterTemp: 0,
  humidity: 0,
  temperature: 0,
  waterLevel: 0,
  phLevel: 0,
  nutrient: 0,
};

function getData() {
  $.ajax({
    url: "/api/sensors",
    // url: "https://hydroponic-dashboard-zcsw.vercel.app/api/sensors",
    type: "GET",
    success: function (data) {
      // Update data hanya jika data tidak null dan data baru diterima

      if (data.waterTemp != null) {
        $("#waterTemp").text(data.waterTemp + " C");
      }
      if (data.waterTemp = null) {
        $("#waterTemp").text("Loading...");
      }

      if (data.humidity != null) {
        $("#humidity").text(data.humidity + " %");
      }

      if (data.temperature != null) {
        $("#temperature").text(data.temperature + " C");
      }

      if (data.waterLevel != null) {
        $("#waterLevel").text(data.waterLevel + " cm");
      }

      if (data.phLevel != null) {
        $("#phLevel").text(data.phLevel);
      }

      if (data.nutrient != null) {
        $("#nutrient").text(data.nutrient + " %");
      }
    },
    error: function (err) {
      console.error("Failed to fetch sensor data:", err);
    },
  });
}
// Panggil fungsi getData setiap 0,1 detik
setInterval(getData, 100);
