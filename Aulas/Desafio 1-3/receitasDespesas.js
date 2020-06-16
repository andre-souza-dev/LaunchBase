const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function main() {
    const users = await fs.existsSync('./receitas_despesas.data') ? JSON.parse(await fs.readFileSync('./receitas_despesas.data')) : [];
    let includeUser = true;

    do {
        const user = {};
        await new Promise((resolve, reject) => {
            rl.question('Nome (deixar em branco para finalizar): ', name => {
                if (name === '') {
                    includeUser = false;
                    rl.close();
                } else {
                    user.name = name;
                }
                resolve();
            })
        })

        let includeRecipe = true;
        const recipes = [];
        if (includeUser) console.log('Receitas: (deixar em branco para finalizar)')
        while (includeRecipe && includeUser) {
            await new Promise((resolve, reject) => {
                rl.question('Receita> ', recipe => {
                    if (recipe === '') {
                        user.recipes = recipes;
                        includeRecipe = false;
                    } else {
                        if (Number(recipe)) recipes.push(Number(recipe));
                    }
                    resolve();
                })
            })
        }
        let includeExpense = true;
        const expenses = [];
        if (includeUser) console.log('Despesas: (deixar em branco para finalizar)')
        while (includeExpense && includeUser) {
            await new Promise((resolve, reject) => {
                rl.question('Despesa> ', expense => {
                    if (expense === '') {
                        user.expenses = expenses;
                        includeExpense = false;
                    } else {
                        if (Number(expense)) expenses.push(Number(expense));
                    }
                    resolve();
                })
            })
        }
        if (user.name) users.push(user);
    } while (includeUser);
    fs.writeFileSync('./receitas_despesas.data', JSON.stringify(users));

    function calculateBalance(recipes, expenses) {
        const recipesSum = arraySum(recipes);
        const expensesSum = arraySum(expenses);
        return recipesSum - expensesSum;

        function arraySum(numbers) {
            return numbers.reduce((previous, current) => {
                return previous + current;
            })
        }
    }

    for (let user of users) {
        const balance = calculateBalance(user.recipes, user.expenses);
        const balanceStatus = balance < 0 ? 'NEGATIVO' : 'POSITIVO';

        console.log(`\n${user.name} possui saldo ${balanceStatus} de ${balance.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`);
    }
    console.log('\n');
}
main();