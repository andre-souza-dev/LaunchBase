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
    }
    )
    await new Promise((resolve, reject) => {
        rl.question('Seu peso: ', weight => {
            pessoa.weight = weight;
            resolve();
        })
    }
    )
    await new Promise((resolve, reject) => {
        rl.question('Sua altura: ', height => {
            pessoa.height = height;
            resolve();
            rl.close();
        })
    }
    )


    const { name, weight, height } = pessoa;
    const imc = weight / (height * height);

    if (imc >= 30) {
        console.log(`\n${name}, você está acima do peso. Seu IMC é ${imc}\n`)
    } else {
        console.log(`\n${name}, você não está acima do peso. Seu IMC é ${imc}\n`)
    }
}
main();