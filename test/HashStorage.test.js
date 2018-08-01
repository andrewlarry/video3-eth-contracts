const assert = require('assert');
const ganche = require('ganache-cli');
const Web3 = require('web3');

const provider = ganche.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let accounts;
let hashStorage; 
const INITIAL_HASH = 'abc123';

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy contract

  // JSON.parse(interface) = JS object that represents the ABI
  hashStorage = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_HASH] })
    .send({ from: accounts[0], gas: '1000000' });

  hashStorage.setProvider(provider);
});

describe('HashStorage', () => {
  it('Deploys a contract', () => {
    // Fails if argument is null or undefined
    assert.ok(hashStorage.options.address);
  });

  it('Initializes hash with constructor argument', async () => {
    const message = await hashStorage.methods.hash().call();
    assert.equal(message, INITIAL_HASH);
  });

  it('Sets a new hash with the setHash() method', async () => {
    await hashStorage.methods.setHash('testing').send({ from: accounts[0] });
    const hash = await hashStorage.methods.hash().call();
    assert.equal(hash, 'testing');
  });
});
