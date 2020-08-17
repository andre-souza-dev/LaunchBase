const recipes = document.querySelectorAll('.recipe');
const buttons = document.querySelectorAll('.button');

if (recipes)
    for (const recipe of recipes) {
        recipe.querySelector('#img').addEventListener('click', () => {
            const id = recipe.getAttribute('id');
            const location = window.location.href;
            const url = location.endsWith('/') ? location : location + '/';
            window.location.assign(url + id)
        })
    }

for (const button of buttons) {
    button.addEventListener('click', () => {
        const id = '#' + button.getAttribute('id').replace('button-', '');
        const section = document.querySelector(id);
        console.log(id);
        if (section)
            section.classList.toggle('hide')
        button.innerHTML = section.classList.contains('hide') ? 'mostrar' : 'esconder';
    })
}

function addInput(event) {
    const buttonName = event.target.name;
    const ingredients = document.querySelector("#ingredients");
    const preparation = document.querySelector('#preparation');
    const fieldContainer = document.querySelectorAll(`.${buttonName}`);

    // Realiza um clone do último input adicionado
    const newField = fieldContainer[ fieldContainer.length - 1 ].cloneNode(true);
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[ 0 ].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[ 0 ].value = "";
    if (buttonName === 'ingredient') {
        ingredients.appendChild(newField);
    } else {
        preparation.appendChild(newField);
    }
}

document
    .querySelectorAll(".add-input")
    .forEach(button => button.addEventListener("click", addInput))