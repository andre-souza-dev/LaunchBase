const main = document.querySelector('main');
const recipes = document.querySelectorAll('.recipe');
const modal = document.querySelector('.modal');
const modalContent = modal.querySelector('#modal__content');
const closeButton = modal.querySelector('#close');

for (let recipe of recipes) {
    recipe.addEventListener('click', () => {
        modalContent.innerHTML = recipe.innerHTML;
        modal.classList.remove('hidden');
        main.classList.add('foggy');
    })
}

closeButton.addEventListener('click', () => {
    modal.classList.add('hidden');
    main.classList.remove('foggy');
})

