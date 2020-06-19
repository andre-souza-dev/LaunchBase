const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function main() {
    const pessoa = {};

    await new Promise((resolve, reject) => {
        rl.question('Seu nome: ', name => {
            pessoa.name = name;
            resolve();
        })
    })
    await new Promise((resolve, reject) => {
        rl.question('Sexo (F/M): ', sex => {
            pessoa.sex = sex.substr(0, 1).toUpperCase();
            if (pessoa.sex !== 'F' && pessoa.sex !== 'M') {
                console.error('\nInput inválido, aceito F ou M somente\n');
                reject();
                process.exit();
            }
            resolve();
        })
    })
    await new Promise((resolve, reject) => {
        rl.question('Sua idade: ', age => {
            if (!Number(age)) {
                console.error('\nIdade deve ser um número.\n');
                reject();
                process.exit();
            }
            pessoa.age = age;
            resolve();
        })
    })
    await new Promise((resolve, reject) => {
        rl.question('Tempo de contibuição: ', contribution => {
            if (!Number(contribution)) {
                console.error('\nTempo de contribuição deve ser um número.\n');
                reject();
                process.exit();
            }
            pessoa.contribution = contribution;
            resolve();
            rl.close();
        })
    })
    const { name, sex, age, contribution } = pessoa;
    if (sex === 'M') {
        if (contribution >= 35 && (age + contribution) >= 95) {
            console.log(`\n${name}, você pode se aposentar!\n`);
        } else {
            console.log(`\n${name}, você ainda não pode se aposentar!\n`);
        }
    }
    if (sex === 'F') {
        if (contribution >= 30 && (age + contribution) >= 85) {
            console.log(`\n${name}, você pode se aposentar!\n`);
        } else {
            console.log(`\n${name}, você ainda não pode se aposentar!\n`);
        }
    }
}

main();
