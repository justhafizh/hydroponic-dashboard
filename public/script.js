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
    // url: "/api/sensors",
    url: "https://hydroponic-dashboard-zcsw.vercel.app/api/sensors",
    type: "GET",
    success: function (data) {
      // Update data hanya jika data tidak null dan data baru diterima
      if (data.waterTemp != null) {
        $("#waterTemp").text(data.waterTemp + " C");
        lastUpdate.waterTemp = currentTime; // Simpan waktu update
      }

      if (data.humidity != null) {
        $("#humidity").text(data.humidity + " %");
        lastUpdate.humidity = currentTime;
      }

      if (data.temperature != null) {
        $("#temperature").text(data.temperature + " C");
        lastUpdate.temperature = currentTime;
      }

      if (data.waterLevel != null) {
        $("#waterLevel").text(data.waterLevel + " cm");
        lastUpdate.waterLevel = currentTime;
      }

      if (data.phLevel != null) {
        $("#phLevel").text(data.phLevel);
        lastUpdate.phLevel = currentTime;
      }

      if (data.nutrient != null) {
        $("#nutrient").text(data.nutrient + " %");
        lastUpdate.nutrient = currentTime;
      }
    },
    error: function (err) {
      console.error("Failed to fetch sensor data:", err);
    },
  });

  // Cek apakah data lama sudah lebih dari 3 detik
  if (currentTime - lastUpdate.waterTemp > 3000) {
    $("#waterTemp").text("Loading...");
  }
  if (currentTime - lastUpdate.humidity > 3000) {
    $("#humidity").text("Loading...");
  }
  if (currentTime - lastUpdate.temperature > 3000) {
    $("#temperature").text("Loading...");
  }
  if (currentTime - lastUpdate.waterLevel > 3000) {
    $("#waterLevel").text("Loading...");
  }
  if (currentTime - lastUpdate.phLevel > 3000) {
    $("#phLevel").text("Loading...");
  }
  if (currentTime - lastUpdate.nutrient > 3000) {
    $("#nutrient").text("Loading...");
  }
}

// Panggil fungsi getData setiap 0,1 detik
setInterval(getData, 100);
