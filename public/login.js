document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const messageElement = document.getElementById('message');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(loginForm);

        fetch('/login', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'failed') {
                    messageElement.className = 'error';
                    messageElement.innerHTML = data.message;
                } else if (data.status === 'success') {
                    messageElement.className = 'success';
                    messageElement.innerHTML = data.message;
                    setTimeout(() => {
                        window.location.href = '/agendamento.html';
                    }, 1000);
                }
            })
            .catch(error => {
                messageElement.className = 'error';
                messageElement.innerHTML = 'Ocorreu um erro ao processar sua solicitação.';
            });
    });
});
