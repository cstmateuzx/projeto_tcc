document.addEventListener('DOMContentLoaded', function() {
    const agendamentoForm = document.getElementById('agendamento-form');
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.getElementById('message');

    agendamentoForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o comportamento padrão do formulário

        const formData = new FormData(agendamentoForm);

        fetch('/agendar', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'failed') {
                messageElement.className = 'error'; // Define a classe para mensagem de erro
                messageElement.innerHTML = data.message;
            } else if (data.status === 'success') {
                messageElement.className = 'success'; // Define a classe para mensagem de sucesso
                messageElement.innerHTML = data.message;
                // Opcional: Limpar o formulário após sucesso
                agendamentoForm.reset();
            }
        })
        .catch(error => {
            messageElement.className = 'error';
            messageElement.innerHTML = 'Ocorreu um erro ao processar sua solicitação.';
        });
    });
});
