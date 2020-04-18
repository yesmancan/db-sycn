
const send = async (url = '', type, data) => {
    let config = {
        method: type,
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'follow',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
    };

    if (String(type) === enums.types.POST) {
        config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);
    return await response.json();

}

const setToken = (token) => {
    localStorage.setItem(enums.localstorage.token, JSON.stringify(token));
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

const getCoolStuff = async () => {
    const coolstuff = document.getElementById('cool-stuff');
    if (coolstuff) {
        await send('/cool', enums.types.GET, null)
            .then((data) => {
                document.getElementById('cool-stuff').innerHTML = data;
            });
    }
}

//#region Init
window.addEventListener('DOMContentLoaded', async (event) => {
    navActiveStatus();
    await getCoolStuff();
});
//#endregion Init

//#region Global 
const toBoolean = (value) => {
    if (value && value.toLowerCase() === 'true') return true;

    return false;
}

const initToogleButtonSwitch = () => {
    $(".bootstrap-switch").each(function () {
        $this = $(this);
        data_on_label = $this.data("on-label") || "";
        data_off_label = $this.data("off-label") || "";
        $this.bootstrapSwitch({ onText: data_on_label, offText: data_off_label });
    })
}
//#endregion Global Module