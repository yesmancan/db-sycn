
const send = async (url = '', type = enums.types.GET, data = {}) => {

    const response = await fetch(url, {
        method: type,
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'follow',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(data)
    })
    return await response.json();

}

const setToken = (token) => {
    localStorage.setItem('token', token);
}

const redirect = (routes) => {
    window.location.href = routes;
}

const navActiveStatus = () => {
    const path = window.location.pathname;

    const link = document.querySelectorAll('.sidebar-wrapper .nav.main-nav > li')
    for (let i = 0; i < link.length; i++) {
        const element = link[i];
        element.classList.remove('active');
        if (element.querySelector('a').getAttribute('href') === path) {
            element.classList.add('active');
        }

    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    navActiveStatus();
});

