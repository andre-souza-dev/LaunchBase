const divDates = document.querySelectorAll('#date');
const divAvatar = document.querySelector("#avatar");
const urlAvatar = document.querySelector('#avatarUrl');
const cards = document.querySelectorAll('.card');

highlightCurrentRoute();
normalizeDate();
loadAvatar();


function normalizeDate() {
    if (divDates)
        for (let div of divDates) {
            if (div && typeof (new Date(div.innerHTML)) === 'object') {
                const utcDate = new Date(div.innerHTML,);
                const student = location.pathname.includes('students');
                const format = student ? {
                    day: "2-digit",
                    month: "long",
                } : {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    }
                const dateFormatted = Intl.DateTimeFormat(undefined, format).format(utcDate).toString();
                div.innerHTML = dateFormatted;
            }
        }
}

function loadAvatar() {
    if (urlAvatar) {
        urlAvatar.addEventListener('change', changeAvatar);
        document.addEventListener('DOMContentLoaded', changeAvatar);
    }
}

function changeAvatar(e) {
    const avatarURL = e.type === 'DOMContentLoaded' && urlAvatar.value !== '' && urlAvatar.validity.valid ? urlAvatar.value
        : urlAvatar.value !== '' && urlAvatar.validity.valid ? urlAvatar.value : 'https://source.unsplash.com/CQvy1NvIKZo/500x500';
    divAvatar.setAttribute('style', `background: url('${avatarURL}') no-repeat center center / cover;`)
}

function highlightCurrentRoute() {
    document.querySelectorAll('header nav a').forEach((linkNode) => {
        const url = linkNode.getAttribute('href');
        if (location.pathname.includes(url)) {
            linkNode.classList.add('active');
        }
    })
}