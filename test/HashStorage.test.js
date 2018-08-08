const assert = require('assert');
const ganche = require('ganache-cli');
const Web3 = require('web3');

const provider = ganche.provider();
const web3 = new Web3(provider);

const compiledContract = require('../build/HashStorage.json');

let accounts;
let contract; 

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Deploy a contract with the first account, account[0]
  contract = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
    .deploy({ data: compiledContract.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  contract.setProvider(provider);
});

describe('HashStorage', () => {
  it('Deploys a contract', () => {
    assert.ok(contract.options.address);
  });

  it('Adds a video to the contract', async () => {
    // Store a hash with the managers account
    await contract.methods.storeHash('abc', '123', 'user1').send({
      from: accounts[0],
      gas: '1000000'
    });

    // The index should now be equal to 2
    const index = await contract.methods.index().call();

    assert.equal(2, index);
  });

  it('Returns the user string from the contract', async () => {
    // Store a hash with the managers account
    await contract.methods.storeHash('abc', '123', 'user1').send({
      from: accounts[0],
      gas: '1000000'
    });

    // Call the getVideo method with the hash
    const user = await contract.methods.getVideo('abc').call();

    assert.equal('user1', user);
  });

  it('Only the manager can store a video', async () => {
    try {
      await contract.methods.storeHash('abc', '123', 'user1').send({
        from: accounts[1],
        gas: '1000000'
      });
      // Should not reach this line
      assert(false);
    } catch(err) {
      assert(err);
    }
  });
});
