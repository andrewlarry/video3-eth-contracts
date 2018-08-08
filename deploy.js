const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const fs = require('fs-extra');
const path = require('path');

// Path to build directory
const buildPath = path.resolve(__dirname, 'build');

const compiledContract = require('./build/HashStorage.json');

// 12 word memonic for deriving accounts
const mnemonic = require('./config/mnemonic');

// Infura remote node enpoint
const { TEST_ENDPOINT } = require('./config/infura');
const provider = new HDWalletProvider(mnemonic, TEST_ENDPOINT);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  const result = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
    .deploy({ data: `0x${compiledContract.bytecode}`})
    .send({ from: accounts[0], gas: '2000000' })
    .catch(err => console.log(err));

  // Store this data in a .json file for future reference
  const contractData = {
    account: accounts[0],
    address: result.options.address,
    interface: compiledContract.interface,
    bytecode: compiledContract.bytecode
  }

  fs.outputJsonSync(
    path.resolve(buildPath, 'deployedHashStorage.json'),
    contractData
  );
};

deploy();
