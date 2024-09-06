async function registerUser(event) {
  event.preventDefault();
  
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = 2;

  const response = await fetch(registerUser_route, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          fullName,
          email,
          password,
          role
      })
  });

  const result = await response.text();

  if (response.ok) {
      const successMessage = document.getElementById('success-message');
      successMessage.textContent = "Cuenta creada exitosamente";
      successMessage.classList.remove('hidden');
      setTimeout(() => {
        successMessage.classList.add('hidden');
        }, 5000);
  } else {
      const errorMsg = document.getElementById('error-msg');
      errorMsg.textContent = "Ya existe una cuenta con el correo que estas ingresando";
      errorMsg.classList.remove('hidden');
      setTimeout(() => {
        errorMsg.classList.add('hidden');
        }, 5000);
  }
}
