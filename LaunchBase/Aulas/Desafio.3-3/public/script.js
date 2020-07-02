const courses = document.querySelectorAll('.course');

for (let course of courses) {
    course.addEventListener('click', () => {
        const courseId = course.getAttribute('id');
        window.location.assign(`/course/${courseId}`);
    })
}
