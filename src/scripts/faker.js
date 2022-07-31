const {faker} = require("@faker-js/faker");

const fakeName = faker.name.findName();
const iban = faker.finance.iban(true);
const cardNumber = faker.finance.creditCardNumber();
const email = faker.internet.email(fakeName);

console.log({
    fakeName,
    email,
    iban,
    cardNumber
});