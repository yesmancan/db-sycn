
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
    localStorage.setItem('token', JSON.stringify(token));
}

const redirect = (routes) => {
    window.location.href = routes;
}

const navActiveStatus = () => {
    const path = window.location.pathname;

    const link = document.querySelectorAll('.sidebar-wrapper .nav.main-nav > li')
    for (let i = 0; i < link.length; i++) {
        const element = link[i];
        const href = element.querySelector('a').getAttribute('href');
        console.log()
        element.classList.remove('active');
        if (href === path) {
            element.classList.add('active');
        } else if (path.includes(href)) {
            const arrHref = path.split('/')
            if (arrHref.length > 0) {
                if ('/' + arrHref[1] === href) {
                    element.classList.add('active');
                }
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    navActiveStatus();
});

const toBoolean = (value) => {
    if (value && value.toLowerCase() === 'true') return true;

    return false;
}