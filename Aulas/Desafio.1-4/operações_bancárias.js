const readline = require('readline');
const fs = require('fs');
const { runInNewContext } = require('vm');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function main() {
    const users = await fs.existsSync('./usuarios.data') ? JSON.parse(await fs.readFileSync('./usuarios.data')) : [];
    let includeUser = true;

    do {
        const user = { name: null, transactions: [], balance: 0 };
        let userIndex = -1;
        await new Promise((resolve, reject) => {
            rl.question('Usuário (deixar em branco para finalizar): ', name => {
                if (name === '') {
                    includeUser = false;
                    rl.close();
                } else {
                    userIndex = users.findIndex(user => user.name === name);
                    if (userIndex === -1) {
                        user.name = name;
                        users.push(user);
                        userIndex = users.length - 1;
                    }
                }
                resolve();
            })
        })

        let includeTransactions = true;
        const transactions = [];
        if (includeUser) console.log('Transações: (deixar em branco para finalizar)')
        while (includeTransactions && includeUser) {
            const transaction = {};
            await new Promise((resolve, reject) => {
                rl.question('Tipo [C]rédito/[D]ébito: ', type => {
                    const initialsType = type.substring(0, 1).toUpperCase();
                    if (type === '') {
                        includeTransactions = false;
                    } else {
                        switch (initialsType) {
                            case 'C':
                                transaction.type = 'credit';
                                break;
                            case 'D':
                                transaction.type = 'debit';
                                break;
                            default:
                                console.log('\nEntrada inválida, assumindo transação como crédito.\n');
                                transaction.type = 'credit';

                        }
                    }
                    resolve();
                })
            })
            if (includeTransactions)
                await new Promise((resolve, reject) => {
                    rl.question('Valor: ', value => {
                        if (value === '') {
                            includeTransactions = false;
                        } else {
                            if (Number(value)) {
                                transaction.value = Number(value);
                                createTransaction(transaction, userIndex);
                            } else {
                                console.log('\nNão foi digitado um número, cancelando transação...\n')
                                includeTransactions = false;
                            }
                        }
                        resolve();
                    })
                })
        }
    } while (includeUser);
    fs.writeFileSync('./usuarios.data', JSON.stringify(users));
    console.log('\n');
    for (const [ index, user ] of users.entries()) {
        const { debit, credit } = getTransactionsCount(index);
        const divisor = '-----------------------------------------------------------------------------------------';
        console.log(divisor.substring(0, (divisor.length - user.name.length) / 2) + user.name + divisor.substring((divisor.length - user.name.length) / 2 + user.name.length));
        console.log(`Saldo: ${user.balance}`)
        console.log(`Maior transação de crédito: ${getHigherTransactionByType('credit', index)}`);
        console.log(`Maior transação de débito: ${getHigherTransactionByType('debit', index)}\n`);
        console.log(`Valor médio das transações: ${getAverageTransactionValue(index)}\n`);
        console.log(`Transações de débito: ${debit}\n`);
        console.log(`Transações de crédito: ${credit}`);
        console.log(divisor + '\n');
    }
    console.log('\n');

    function createTransaction(transaction, userIndex) {
        const { type, value } = transaction;
        const newBalance = type === 'debit' ? users[ userIndex ].balance - value : users[ userIndex ].balance + value;
        users[ userIndex ].transactions.push({ type, value });
        users[ userIndex ].balance = newBalance;
    }
    function getHigherTransactionByType(type, userIndex) {
        const transaction = users[ userIndex ].transactions.reduce((current, next) => {
            if (current.type !== type)
                if (!next || next.type !== type) return { type, value: 0 }
                else return next
            if (next.type === type && next.value > current.value)
                return next;
            return current;
        });
        if (transaction.type === type)
            return transaction.value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
        return `(não há nenhuma transação)`
    }

    function getAverageTransactionValue(userIndex) {
        const totalValue = users[ userIndex ].transactions.reduce((acumulator, transaction) => acumulator + transaction.value, 0);
        const averageValue = totalValue / users[ userIndex ].transactions.length;
        return averageValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    }

    function getTransactionsCount(userIndex) {
        const debit = users[ userIndex ].transactions.filter(transaction => transaction.type === 'debit').length;
        const credit = users[ userIndex ].transactions.filter(transaction => transaction.type === 'credit').length;
        return { credit, debit }
    }
}
main();