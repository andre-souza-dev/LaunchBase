const fs = require('fs');

async function readUserData() {
    if (!(await fs.existsSync('./usuarios.data'))) {
        console.log('usuarios.data não encontrado. Utilize o usuarios.js para gerar um novo arquivo de dados.');
        process.exit();
    }
    const users = JSON.parse(await fs.readFileSync('./usuarios.data'));
    return users;
}
function checkIfUserUsesCSS(user) {
    return user.technologies.some(technology => technology === "CSS");
}

async function main() {
    const users = await readUserData();
    console.log('\n');
    for (let user of users) {
        const userWorksWithCSS = checkIfUserUsesCSS(user);
        if (userWorksWithCSS)
            console.log(`O usuário ${user.name} trabalha com CSS`);
    }
    console.log('\n');
}

main();