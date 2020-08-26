const divDates = document.querySelectorAll('#date');
const divAvatar = document.querySelector("#avatar");
const urlAvatar = document.querySelector('#avatarUrl');
const cards = document.querySelectorAll('.card');
const pagination = document.querySelector('#pagination');

highlightCurrentRoute();
normalizeDate();
loadAvatar();

if (pagination) paginate();


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

function paginate() {
    const selectedPage = Number(pagination.dataset.page);
    const limit = Number(pagination.dataset.limit);
    const totalPages = Number(pagination.dataset.totalPages);
    const filter = pagination.dataset.filter ? '&filter=' + pagination.dataset.filter : '';
    const person = window.location.href.includes('teacher') ? 'teachers' : 'students';
    const pages = [];
    let oldPage;
    console.log(pagination)
    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const firstAndLastPage = currentPage >= totalPages - 1 || currentPage <= 2;
        const currentPageInterval = currentPage <= selectedPage + 1 && currentPage >= selectedPage - 1;

        if (firstAndLastPage || currentPageInterval) {

            if (oldPage > 1 && currentPage - oldPage > 2)
                pages.push('<span>...</span>');

            if (oldPage > 1 && currentPage - oldPage == 2)
                pages.push(`<a href="/${person}?page=${currentPage - 1}&limit=${limit}">${currentPage - 1}</a>`);

            if (currentPage == selectedPage) {
                pages.push(`<span>${currentPage}</span>`);
            } else {
                pages.push(`<a href="/${person}?page=${currentPage}&limit=${limit}${filter}">${currentPage}</a>`);
            }
            oldPage = currentPage;
        }
    }
    pagination.innerHTML = pages.toString().replace(/\,/g, '\n');
}
