// Feather icons
feather.replace();

// Show/Hide log card
const toggleBtn = document.getElementById('toggleLog');
const logCard = document.getElementById('logCard');
const closeBtn = document.getElementById('closeLog');

toggleBtn.addEventListener('click', () => {
  logCard.classList.remove('hidden');
});

closeBtn.addEventListener('click', () => {
  logCard.classList.add('hidden');
});

// Log DOM targets
const jsonData1 = document.getElementById('jsonData1');
const jsonData2 = document.getElementById('jsonData2');

let logs1 = [];
let logs2 = [];

function addLog(logList, targetUl, log) {
  if (logList.length >= 5) logList.shift(); // max 5 logs
  logList.push(log);
  targetUl.innerHTML = logList.map(l => `<li>{ ${l} }</li>`).join('');
}

// Fetch sensor data + update UI + logs
function getData() {
  $.ajax({
    url: "/api/sensors",
    type: "GET",
    success: function (sensorData) {
      const now = new Date();
      // Update last received time
      $("#time").text("Time: " + now.toLocaleTimeString());
      // SENSOR 01
      if (sensorData.sensor_01) {
        const s1 = sensorData.sensor_01;
        // Update UI
        $("#water_temperature").text(s1.water_temperature);
        $("#ph_value").text(s1.ph_value);
        $("#tds_value").text(s1.tds_value);

        // Update pH Status
        const ph = parseFloat(s1.ph_value);
        let phStatus = "";
        let phClass = "";
        if (ph < 6.0) {
          phStatus = "pH Low";
          phClass = "bg-red-100 text-red-600";
        } else if (ph >= 6.0 && ph <= 7.0) {
          phStatus = "pH Neutral";
          phClass = "bg-green-100 text-green-600";
        } else if (ph > 7.0) {
          phStatus = "pH High";
          phClass = "bg-red-500 text-white";
        }
        if (phStatus) {
          $("#ph_status").text(phStatus).attr("class", `text-[10px] font-bold px-2 py-0.5 rounded-full bg-white-200 ${phClass}`).removeClass("hidden");
        } else {
          $("#ph_status").addClass("hidden");
        }

        // Update Nutrient Status
        const tds = parseFloat(s1.tds_value);
        let tdsStatus = "";
        let tdsClass = "";
        if (tds < 400) {
          tdsStatus = "Nutrient Low";
          tdsClass = "bg-yellow-100 text-yellow-600";
        } else if (tds >= 400 && tds <= 1000) {
          tdsStatus = "Nutrient Good";
          tdsClass = "bg-green-100 text-green-600";
        } else if (tds > 1000) {
          tdsStatus = "Nutrient High";
          tdsClass = "bg-red-100 text-red-600";
        }
        if (tdsStatus) {
          $("#tds_status").text(tdsStatus).attr("class", `text-[10px] font-bold px-2 py-0.5 rounded-full ${tdsClass}`).removeClass("hidden");
        } else {
          $("#tds_status").addClass("hidden");
        }

        // Update label info
        $("#deviceId1").text("Device ID: " + (s1.device_id || "Unknown"));
        $("#IPDevice_1").text("IP Device: " + (s1.IPDevice || "N/A"));
        $("#IPGateway_1").text("Device Gateway: " + (s1.IPGateway || "N/A"));

        // Update log
        const logString = JSON.stringify(sensorData.sensor_01, null, 2); // 2 = indent 2 spasi
        addLog(logs1, jsonData1, logString);
      } else {
        $("#water_temperature").text("Loading...");
        $("#ph_value").text("Loading...");
        $("#tds_value").text("Loading...");
        $("#ph_status").text("Loading...").attr("class", "text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-500");
        $("#tds_status").text("Loading...").attr("class", "text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-500");
        $("#deviceId1").text("Device ID: -");
        $("#IPDevice_1").text("IP Device: -");
        $("#IPGateway_1").text("Device Gateway: -");
        jsonData1.innerHTML = "<li>Waiting for data...</li>";
      }

      // SENSOR 02
      if (sensorData.sensor_02) {
        const s2 = sensorData.sensor_02;

        // Update UI
        $("#temperature").text(s2.temperature);
        $("#humidity").text(s2.humidity);
        $("#pressure").text(s2.pressure);

        $("#deviceId2").text("Device ID: " + (s2.device_id || "Unknown"));
        $("#IPDevice_2").text("IP Device: " + (s2.IPDevice || "N/A"));
        $("#IPGateway_2").text("Device Gateway: " + (s2.IPGateway || "N/A"));

        const logString = JSON.stringify(sensorData.sensor_02, null, 2); // 2 = indent 2 spasi
        addLog(logs2, jsonData2, logString);
      } else {
        $("#temperature").text("Loading...");
        $("#humidity").text("Loading...");
        $("#pressure").text("Loading...");
        $("#deviceId2").text("Device ID: -");
        $("#IPDevice_2").text("IP Device: -");
        $("#IPGateway_2").text("Device Gateway: -");
        jsonData2.innerHTML = "<li>Waiting for data...</li>";
      }
    },
    error: function (err) {
      console.error("Failed to fetch sensor data:", err);
    },
  });
}


// Call per 1 detik
setInterval(getData, 1000);
