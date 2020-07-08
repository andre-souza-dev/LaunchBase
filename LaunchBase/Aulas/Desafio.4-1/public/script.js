const recipes = document.querySelectorAll('.recipe');
const buttons = document.querySelectorAll('.button');

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
