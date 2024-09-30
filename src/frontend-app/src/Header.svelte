
<style>
    @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

    :root {
        --main-color: #333;
        --black: #141414;
        --bg: #010103;
        --border: 0.1rem solid rgba(255, 255, 255, 0.3);
        font-size: 10px;
    }

    * {
        margin: 0;
        padding: 0;
        outline: none;
        text-decoration: none;
        border: none;
        text-transform: capitalize;
        transition: 0.2s linear;
        font-family: "Roboto", sans-serif;
    }
    section {
        padding: 3rem 2rem;
        margin: 0 auto;
        max-width: 1200px;
    }

    .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 99;
        border-bottom: var(--border);
        background-color: var(--black);
    }

    .header section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
    }

    .header section .logo {
        width: 6rem;
        height: 6rem;
    }

    .header section .logo:hover {
        width: 7rem;
        height: 7rem;
    }

    .navbar a {
        margin: 0 1rem;
        font-size: 1.8rem;
        color: #fff;
    }

    .navbar a:hover {
        color: var(--main-color);
        border-bottom: var(--border);
    }

    .icons img {
        height: 2.5rem;
        width: 2.5rem;
        margin: 1rem;
        cursor: pointer;
    }

    .icons img:hover {
        height: 3rem;
        width: 3rem;
    }
</style>
