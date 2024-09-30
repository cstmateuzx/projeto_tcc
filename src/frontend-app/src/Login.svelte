<script>
    import { onMount } from 'svelte';
    let email = '';
    let senha = '';
    let mensagem = '';

    async function handleSubmit(event) {
        event.preventDefault();

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await res.json();
        if (res.ok) {
            mensagem = 'Login bem-sucedido!';
            // Aqui você pode redirecionar ou armazenar a sessão do usuário
        } else {
            mensagem = data.error;
        }
    }
</script>

<form on:submit={handleSubmit}>
    <label>
        Email:
        <input type="email" bind:value={email} required />
    </label>
    <label>
        Senha:
        <input type="password" bind:value={senha} required />
    </label>
    <button type="submit">Login</button>
</form>

{#if mensagem}
    <p>{mensagem}</p>
{/if}
