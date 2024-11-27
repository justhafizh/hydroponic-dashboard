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
  const currentTime = Date.now(); // Waktu saat ini dalam milidetik
  $.ajax({
    url: "/api/sensors",
    type: "GET",
    success: function (data) {
      // Update data hanya jika data tidak null dan data baru diterima
      if (data.waterTemp != null) {
        $("#waterTemp").text(data.waterTemp + " C");
        lastUpdate.waterTemp = currentTime; // Simpan waktu update
      } else if (currentTime - lastUpdate.waterTemp > 5000) {
        // Hapus data jika lebih dari 5 detik
        $("#waterTemp").text("Loading...");
      }
      
      if (data.humidity != null) {
        $("#humidity").text(data.humidity + " %");
        lastUpdate.humidity = currentTime;
      } else if (currentTime - lastUpdate.humidity > 5000) {
        $("#humidity").text("Loading...");
      }

      if (data.temperature != null) {
        $("#temperature").text(data.temperature + " C");
        lastUpdate.temperature = currentTime;
      } else if (currentTime - lastUpdate.temperature > 5000) {
        $("#temperature").text("Loading...");
      }

      if (data.waterLevel != null) {
        $("#waterLevel").text(data.waterLevel + " cm");
        lastUpdate.waterLevel = currentTime;
      } else if (currentTime - lastUpdate.waterLevel > 5000) {
        $("#waterLevel").text("Loading...");
      }

      if (data.phLevel != null) {
        $("#phLevel").text(data.phLevel);
        lastUpdate.phLevel = currentTime;
      } else if (currentTime - lastUpdate.phLevel > 5000) {
        $("#phLevel").text("Loading...");
      }

      if (data.nutrient != null) {
        $("#nutrient").text(data.nutrient + " %");
        lastUpdate.nutrient = currentTime;
      } else if (currentTime - lastUpdate.nutrient > 5000) {
        $("#nutrient").text("Loading...");
      }
    },
    error: function (err) {
      console.error("Failed to fetch sensor data:", err);
    },
  });
}
// Panggil fungsi getData setiap 0,1 detik
setInterval(getData, 100);
