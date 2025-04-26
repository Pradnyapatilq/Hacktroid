const hospitals = [
  // Existing Delhi hospitals...
  {
    name: "City Care Hospital",
    address: "Main Road, Central Delhi",
    lat: 28.6139,
    lng: 77.2090,
    totalBeds: 120,
    availableBeds: 15,
    email:"citycare@gmail.com"
  },
  {
    name: "Green Life Hospital",
    address: "North Block, Delhi",
    lat: 28.6200,
    lng: 77.2300,
    totalBeds: 80,
    availableBeds: 8,
    email:"greenlife@gmail.com"
  },
  {
    name: "Hope Medical Center",
    address: "East Sector, Delhi",
    lat: 28.6400,
    lng: 77.2000,
    totalBeds: 100,
    availableBeds: 0,
    email:"hopemedical@gmail.com"
  },

  // 🔽 New Bangalore hospitals
  {
    name: "Manipal Hospital",
    address: "Old Airport Road, Bangalore",
    lat: 12.9601,
    lng: 77.6387,
    totalBeds: 250,
    availableBeds: 20,
    email:"manipalhospital@gmail.com"
  },
  {
    name: "Fortis Hospital",
    address: "Bannerghatta Road, Bangalore",
    lat: 12.9070,
    lng: 77.5850,
    totalBeds: 180,
    availableBeds: 25,
    email:"fortishospital@gmail.com"
  },
  {
    name: "St. John's Medical College Hospital",
    address: "Koramangala, Bangalore",
    lat: 12.9352,
    lng: 77.6227,
    totalBeds: 300,
    availableBeds: 50,
    email:"stjohnhospital@gmail.com"
  }
];


let map;

function findHospitals() {
  const location = document.getElementById('locationInput').value;
  if (!location) return alert("Please enter a location.");

  // Geocode using Nominatim (OpenStreetMap)
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) return alert("Location not found.");
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      showMapAndHospitals(lat, lon);
    })
    .catch(err => alert("Error fetching location."));
}

function showMapAndHospitals(userLat, userLng) {
  if (map) {
    map.remove(); // Reset map if already exists
  }
  map = L.map('map').setView([userLat, userLng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  L.marker([userLat, userLng]).addTo(map)
    .bindPopup("Your Location")
    .openPopup();

  const list = document.getElementById("hospitalList");
  list.innerHTML = '';

  hospitals.forEach(hospital => {
    const distance = getDistance(userLat, userLng, hospital.lat, hospital.lng);
    if (distance <= 10) {
      const div = document.createElement('div');
      div.className = 'hospital-card';
      div.innerHTML = `
  <h3>${hospital.name}</h3>
  <p><strong>Address:</strong> ${hospital.address}</p>
  <p><strong>Email:</strong> <a href="mailto:${hospital.email}">${hospital.email}</a></p>
  <p><strong>Total Beds:</strong> ${hospital.totalBeds}</p>
  <p><strong>Available Beds:</strong> ${hospital.availableBeds}</p>
  <p><strong>Distance:</strong> ${distance.toFixed(2)} km</p>
`;

      list.appendChild(div);

      L.marker([hospital.lat, hospital.lng])
        .addTo(map)
        .bindPopup(`<strong>${hospital.name}</strong><br/>Beds Available: ${hospital.availableBeds}`);
    }
  });
}

// Haversine distance formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
