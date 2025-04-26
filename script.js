document.getElementById('qrForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.getElementById("name").value;
    const blood = document.getElementById("blood").value;
    const problem = document.getElementById("problem").value;
    const contact = document.getElementById("contact").value;
    const other = document.getElementById("other").value;
  
    let locationText = "Fetching location...";
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const lat = pos.coords.latitude.toFixed(4);
      const lon = pos.coords.longitude.toFixed(4);
      locationText = `Location: (${lat}, ${lon})`;
    } catch (err) {
      locationText = "Location access denied";
    }
  
    const qrData = `Name: ${name}
  Blood: ${blood}
  Issue: ${problem}
  Contact: ${contact}
  Other Info: ${other}
  ${locationText}`;
  
    document.getElementById("qr").innerHTML = "";
    const qr = new QRCode(document.getElementById("qr"), {
      text: qrData,
      width: 200,
      height: 200,
    });
  
    document.getElementById("sendBtn").style.display = "inline-block";
    document.getElementById("sendBtn").onclick = () => {
      alert("QR sent to nearest heart-related hospital!");
    };
  });
  