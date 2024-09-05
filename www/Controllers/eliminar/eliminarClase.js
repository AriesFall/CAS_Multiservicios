function salirClase() {
    const urlParams = new URLSearchParams(window.location.search);
    const claseId = urlParams.get('id');

    const correo = localStorage.getItem('correo');

    if (!claseId || !correo) {
        alert('No se pudo obtener la información necesaria para salir de la clase.');
        return;
    }

    fetch(leaveClass_route + claseId, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            window.location.href = './index.html';
        }
    })
    .catch(error => console.error('Error al salir de la clase:', error));
}
