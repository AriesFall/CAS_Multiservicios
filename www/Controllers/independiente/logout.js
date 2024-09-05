document.addEventListener('DOMContentLoaded', function() {
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('correo');
    window.location.href = '/index.html';
  }
  window.logout = logout;
});