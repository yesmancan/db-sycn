const email = document.getElementById('email');
const password = document.getElementById('password');
const showhidepassword = document.getElementById('show-password');

const login = () => {
    const data = {
        email: email.value,
        password: password.value,
    }
    const res = send('/api/user/login', enums.types.POST, data)
        .then((data) => {
            console.log(data);

            setToken(data);

            redirect(enums.routes.Home)
        });
}

email.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        login();
    }
});


password.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        login();
    }
});

showhidepassword.addEventListener("click", (event) => {
    if (password.getAttribute('type') === 'password') {
        password.setAttribute('type', 'text');
        showhidepassword.style.opacity = 1;
    } else {
        password.setAttribute('type', 'password');
        showhidepassword.style.opacity = 0.5;
    }
});
