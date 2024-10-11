const ethers = require("ethers");
const fs = require('fs'); 

const araTokenPath = `./artifacts/contracts/ARAToken.sol/ARATOKEN.json`;
const proxyAdminPath = `./artifacts/@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol/ProxyAdmin.json`;
const proxyPath = `./artifacts/@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol/TransparentUpgradeableProxy.json`;
const araTokenArtifactRaw = fs.readFileSync(araTokenPath);
const proxyAdminArtifactRaw = fs.readFileSync(proxyAdminPath);
const proxyArtifactRaw = fs.readFileSync(proxyPath);
const araTokenArtifact = JSON.parse(araTokenArtifactRaw);
const proxyAdminArtifact = JSON.parse(proxyAdminArtifactRaw);
const proxyArtifact = JSON.parse(proxyArtifactRaw);
// console.log(`ARA Token ABI: ` + proxyArtifact.abi);
// console.log(`ARA Token Bytecode: ` + proxyArtifact.bytecode);
// const INFURA_KEY = process.env.INFURA_KEY
// const sepolia = 'https://sepolia.infura.io/v3/' + INFURA_KEY

function getInitializerData(contractInterface, args) {
  const initializer = 'initialize';
  const fragment = contractInterface.getFunction(initializer);
  return contractInterface.encodeFunctionData(fragment, args);
}

async function main() {
  console.log(ethers.version);
  const transactionCount = 560;
  const address = '0x80Cbc1f7fd60B7026C0088e5eD58Fc6Ce1180141'
  // const [owner] = await ethers.getSigners()
  //const transactionCount = await owner.getNonce()
  console.log(`Here is the deployment offline by ${address}, nonce: ${transactionCount}`);

  const ARAToken = new ethers.ContractFactory(araTokenArtifact.abi, araTokenArtifact.bytecode);
  const deployTx = await ARAToken.getDeployTransaction();
  fs.writeFileSync("e_tx_ara.txt", deployTx.data); 

  const tokenAddr = ethers.getCreateAddress({from: address, nonce: transactionCount});
  // Here we will use the hardhat
  const ProxyAdmin = new ethers.ContractFactory(proxyAdminArtifact.abi, proxyAdminArtifact.bytecode);
  const proxyAdminTx = await ProxyAdmin.getDeployTransaction(address);
  fs.writeFileSync("e_tx_proxyadmin.txt", proxyAdminTx.data); 

  const proxyAdminAddr = ethers.getCreateAddress({from: address, nonce: transactionCount + 1});

  const Proxy = new ethers.ContractFactory(proxyArtifact.abi, proxyArtifact.bytecode);
  const proxy = await Proxy.getDeployTransaction(
    tokenAddr,
    proxyAdminAddr,
    getInitializerData(ARAToken.interface, []),
  );
  fs.writeFileSync("e_tx_proxy.txt", proxy.data); 

  console.log("Done");
}

main();