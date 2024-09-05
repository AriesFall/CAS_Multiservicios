document.addEventListener('DOMContentLoaded', (event) => {
    const token = localStorage.getItem('token');
    if (token) {
        const nivelCuenta = parseInt(localStorage.getItem('nivelCuenta'));
        if (nivelCuenta === 1) {
            window.location.href = './Views/admin/index.html';
        } else if (nivelCuenta === 2) {
            window.location.href = './Views/teacher/index.html';
        } else if (nivelCuenta === 3) {
            window.location.href = './Views/user/index.html';
        }
    }
});