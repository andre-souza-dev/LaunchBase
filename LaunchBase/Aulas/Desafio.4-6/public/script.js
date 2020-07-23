const divDates = document.querySelectorAll('#date');
const divAvatar = document.querySelector("#avatar");
const urlAvatar = document.querySelector('#avatarUrl');
const teacherHomeDiv = document.querySelector('#teachersection')
const cards = document.querySelectorAll('.card');

if (divDates)
    for (let div of divDates) {
        if (div && typeof (new Date(div.innerHTML)) === 'object') {
            const utcDate = new Date(div.innerHTML);
            const dateFormatted = Intl.DateTimeFormat(undefined, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }).format(utcDate).toString();
            div.innerHTML = dateFormatted;
        }
    }

if (urlAvatar) {
    urlAvatar.addEventListener('change', changeAvatar);
    document.addEventListener('DOMContentLoaded', changeAvatar);
}
if (teacherHomeDiv)
    teacherHomeDiv.addEventListener('click', () => window.location.assign('teachers/create'))
if (cards && window.location.pathname === '/teachers')
    for (let card of cards) {
        const id = card.getAttribute('id');
        card.setAttribute('style', 'cursor:pointer;')
        card.addEventListener('click', () => window.location.assign(`teacher/${id}`))
    }
function changeAvatar(e) {
    const avatarURL = e.type === 'DOMContentLoaded' && urlAvatar.validity.valid && urlAvatar.value !== '' ? urlAvatar.value
        : e.target.validity.valid && e.target.value !== '' ? e.target.value : 'https://source.unsplash.com/CQvy1NvIKZo/500x500';
    divAvatar.setAttribute('style', `background: url('${avatarURL}') no-repeat center center / cover;`)
}
