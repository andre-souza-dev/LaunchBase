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
        rl.question('Sua idade: ', age => {
            pessoa.age = age;
            resolve();
        })
    })


    console.log('\nTecnologias: (deixar em branco para finalizar)\n');
    let includeTechnologies = true;
    pessoa.technologies = [];

    while (includeTechnologies) {
        const technology = {};
        await new Promise((resolve, reject) => {
            rl.question('Nome da tecnologia: ', name => {
                technology.name = name;
                resolve();
            })
        })
        await new Promise((resolve, reject) => {
            rl.question('Especialidade: ', especialty => {
                technology.especialty = especialty;
                resolve();
            })
        })
        if (technology.name === '' || technology.especialty === '') {
            includeTechnologies = false;
            rl.close();
        } else {
            pessoa.technologies.push(technology);
        }
    }

    console.log(`\n\nO usuário ${pessoa.name} tem ${pessoa.age} anos e usa a tecnologia ${pessoa.technologies[ 0 ].name} com especialidade em ${pessoa.technologies[ 0 ].especialty}\n`);

}
main();