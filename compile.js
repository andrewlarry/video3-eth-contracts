const path = require('path');
const fs = require('fs-extra');
const { compile } = require('solc');

// Get path to build directory and remove
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath)

// Path to a smart contract
const contractPath = path.resolve(__dirname, 'contracts', 'HashStorage.sol');

// Read the contract file and compile with solc
const source = fs.readFileSync(contractPath, 'utf8');
const compiled = compile(source, 1).contracts;

// Rebuild the build directory
fs.ensureDirSync(buildPath);

fs.outputJsonSync(
  path.resolve(buildPath, 'HashStorage.json'),
  compiled[':HashStorage']
);
