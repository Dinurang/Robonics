const form = document.getElementById("contact-form");
const responseMessage = document.getElementById("response-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  };

  try {
    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    responseMessage.innerText = data.message;
    responseMessage.style.color = "green";
    form.reset();
  } catch (err) {
    console.error(err);
    responseMessage.innerText = "Failed to send message.";
    responseMessage.style.color = "red";
  }
});
