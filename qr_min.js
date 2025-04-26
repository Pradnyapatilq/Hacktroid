function generateQR() {
  const fullName = document.getElementById("fullName").value;
  const age = document.getElementById("age").value;
  const bloodGroup = document.getElementById("bloodGroup").value;
  const emergencyContact = document.getElementById("emergencyContact").value;
  const healthProblem = document.getElementById("healthProblem").value;

  if (!fullName || !age || !bloodGroup || !emergencyContact || !healthProblem) {
    alert("Please fill all the fields (except hospital email).");
    return;
  }

  const data = `Name: ${fullName}\nAge: ${age}\nBlood Group: ${bloodGroup}\nContact: ${emergencyContact}\nProblem: ${healthProblem}`;

  QRCode.toCanvas(document.createElement('canvas'), data, (error, canvas) => {
    if (error) return console.error(error);
    const qrcodeDiv = document.getElementById("qrcode");
    qrcodeDiv.innerHTML = "";
    qrcodeDiv.appendChild(canvas);

    // Reveal hospital email input and send button
    document.getElementById("hospitalSection").style.display = "block";
  });
}

function sendToHospital() {
  const canvas = document.querySelector("#qrcode canvas");
  const hospitalEmail = document.getElementById("hospitalEmail").value;

  if (!canvas || !hospitalEmail) {
    alert("Please generate the QR and enter the hospital's email.");
    return;
  }

  const imageData = canvas.toDataURL("image/png");

  fetch("http://localhost:3000/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: imageData,
      hospitalEmail: hospitalEmail
    }),
  })
    .then(res => res.ok ? alert("Email sent to hospital!") : res.text().then(alert))
    .catch(err => alert("Error: " + err));
}
