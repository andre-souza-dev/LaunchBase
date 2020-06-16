const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function main() {
    const users = await fs.existsSync('./usuarios.data') ? JSON.parse(await fs.readFileSync('./usuarios.data')) : [];
    let includeUser = true;

    do {
        const user = {};
        await new Promise((resolve, reject) => {
            rl.question('Usuário (deixar em branco para finalizar): ', name => {
                if (name === '') {
                    includeUser = false;
                    rl.close();
                } else {
                    user.name = name;
                }
                resolve();
            })
        })

        let includeTechnology = true;
        const technologies = [];
        if (includeUser) console.log('Tecnologias: (deixar em branco para finalizar)')
        while (includeTechnology && includeUser) {
            await new Promise((resolve, reject) => {
                rl.question('> ', technology => {
                    if (technology === '') {
                        user.technologies = technologies;
                        includeTechnology = false;
                    } else {
                        technologies.push(technology);
                    }
                    resolve();
                })
            })
        }
        if (user.name) users.push(user);
    } while (includeUser);
    fs.writeFileSync('./usuarios.data', JSON.stringify(users));
    console.log('\n');
    for (let user of users)
        console.log(`\n${user.name} trabalha com ${user.technologies.join(', ')}`);
    console.log('\n');
}
main();