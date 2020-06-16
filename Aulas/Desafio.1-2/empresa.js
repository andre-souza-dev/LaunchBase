const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function main() {
    const company = {};
    console.log('\nInsira os dados da sua empresa\n');
    await new Promise((resolve, reject) => {
        rl.question('Nome: ', name => {
            company.name = name;
            resolve();
        })
    })
    await new Promise((resolve, reject) => {
        rl.question('Cor: ', color => {
            company.color = color;
            resolve();
        })
    })
    await new Promise((resolve, reject) => {
        rl.question('Foco: ', focus => {
            company.focus = focus;
            resolve();
        })
    })
    console.log('\nEndereço:')
    const address = {};
    await new Promise((resolve, reject) => {
        rl.question('Rua: ', street => {
            address.street = street;
            resolve();
        })
    })
    await new Promise((resolve, reject) => {
        rl.question('Número: ', number => {
            address.number = number;
            resolve();
            rl.close();
        })
    })
    company.address = address;

    console.log(`\nA empresa ${company.name} está localizada em ${company.address.street}, ${company.address.number}\n`);
}

main();