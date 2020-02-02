const login = () => {
    const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    }
    const res = send('/api/user/login', enums.types.POST, data)
        .then((data) => {
            console.log(data);

            setToken(data);

            redirect(enums.routes.Home)
        });
}
