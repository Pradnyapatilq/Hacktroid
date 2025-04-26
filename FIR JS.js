const form = document.getElementById("firForm");
const output = document.getElementById("firOutput");

// Sample police stations with lat/lng (expand as needed)
const policeStations = [
  { name: "Connaught Place Police Station", lat: 28.6315, lng: 77.2167 },
  { name: "Bandra Police Station", lat: 19.0551, lng: 72.8295 },
  { name: "Indiranagar Police Station", lat: 12.9716, lng: 77.6412 },
  { name: "Chennai City Police HQ", lat: 13.0827, lng: 80.2707 }
];

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function findNearestPoliceStation(lat, lng) {
  let nearest = null;
  let minDist = Infinity;

  for (let station of policeStations) {
    const dist = getDistance(lat, lng, station.lat, station.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = station;
    }
  }

  return nearest;
}

function getLocationAndSubmitFIR(formData) {
  if (!navigator.geolocation) {
    alert("Geolocation not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const nearestStation = findNearestPoliceStation(lat, lng);
    const locationText = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)} (Nearest: ${nearestStation.name})`;

    const now = new Date().toLocaleString();

    document.getElementById("outName").textContent = formData.name;
    document.getElementById("outLocation").textContent = locationText;
    document.getElementById("outTime").textContent = now;
    document.getElementById("outVehicle").textContent = formData.vehicle || "N/A";
    document.getElementById("outWitness").textContent = formData.witness || "N/A";
    document.getElementById("outDescription").textContent = formData.description;

    document.getElementById("submissionStatus").textContent =
      `✅ FIR submitted to ${nearestStation.name}`;

    output.style.display = "block";
  }, error => {
    alert("Unable to fetch location.");
  });
}

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById("name").value,
    vehicle: document.getElementById("vehicle").value,
    witness: document.getElementById("witness").value,
    description: document.getElementById("description").value
  };

  getLocationAndSubmitFIR(formData);
});