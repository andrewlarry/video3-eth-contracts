const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const fs = require('fs');

const { interface, bytecode } = require('./compile');

// 12 word memonic for deriving accounts
const mnemonic = require('./config/mnemonic');

// Infura remote node enpoint
const { TEST_ENDPOINT } = require('./config/infura');

const provider = new HDWalletProvider(mnemonic, TEST_ENDPOINT);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('account: ', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: `0x${bytecode}`, arguments: ['deploy'] })
    .send({ from: accounts[0], gas: '2000000' })
    .catch(err => console.log(err));

  console.log('address: ', result.options.address);

  const contractData = {
    account: accounts[0],
    address: result.options.address,
    interface,
    bytecode
  }

  fs.writeFile("/config/contract.json", contractData, 'utf8', err => {
    if (err) return console.log(err);
    console.log("The file was saved!");
  }); 
};

deploy();