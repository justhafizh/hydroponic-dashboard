async function fetchData() {
  try {
    const response = await fetch("/api/sensors"); // Mengambil data dari server yang sama
    const data = await response.json();

    document.getElementById("waterTemp").querySelector("p").textContent = `Value: ${data.waterTemp}`;
    document.getElementById("humidity").querySelector("p").textContent = `Value: ${data.humidity}`;
    document.getElementById("temperature").querySelector("p").textContent = `Value: ${data.temperature}`;
    document.getElementById("waterLevel").querySelector("p").textContent = `Value: ${data.waterLevel}`;
    document.getElementById("phLevel").querySelector("p").textContent = `Value: ${data.phLevel}`;
    document.getElementById("nutrient").querySelector("p").textContent = `Value: ${data.nutrient}`;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
setInterval(fetchData, 5000); // Memperbarui data setiap 5 detik

