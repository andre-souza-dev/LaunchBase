const recipes = document.querySelectorAll('.recipe');
const buttons = document.querySelectorAll('.button');

const divDates = document.querySelectorAll('#date');

for (let recipe of recipes) {
    recipe.addEventListener('click', () => {
        const id = recipe.getAttribute('id');
        window.location.assign(`/recipes/${id}`)
    })
}

for (let button of buttons) {
    button.addEventListener('click', () => {
        const id = '#' + button.getAttribute('id').replace('button-', '');
        const section = document.querySelector(id);
        console.log(id);
        if (section)
            section.classList.toggle('hide')
        button.innerHTML = section.classList.contains('hide') ? 'mostrar' : 'esconder';
    })
}

(function formatDate() {
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
})();