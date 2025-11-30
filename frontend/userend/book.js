document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const projectDescription = document.getElementById('projectDescription').value;
  const deadline = document.getElementById('deadline').value;
  const clientName = document.getElementById('clientName').value;
  const clientEmail = document.getElementById('clientEmail').value;
  const clientPhone = document.getElementById('clientPhone').value;

  const res = await fetch('http://localhost:3000/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectDescription, deadline, clientName, clientEmail, clientPhone })
  });

  alert(await res.text());
});
