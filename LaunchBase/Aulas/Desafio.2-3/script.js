const courses = document.querySelectorAll('.course');
const modal = document.querySelector('.modal');
const iframe = modal.querySelector('iframe');
const closeButton = modal.querySelector('#close');
const maximizeButton = modal.querySelector('#maximize');

for (let course of courses) {
    course.addEventListener('click', () => {
        const courseId = course.getAttribute('id');
        iframe.src = `https://rocketseat.com.br/${courseId}`;
        modal.classList.remove('hidden');
        modal.classList.remove('maximize');
    })
}

closeButton.addEventListener('click', () => {
    modal.classList.add('hidden');
    iframe.src = '';
})

maximizeButton.addEventListener('click', () => {
    modal.classList.toggle('maximize');
})