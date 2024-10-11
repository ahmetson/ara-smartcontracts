const { ethers } = require("hardhat");
const fs = require('fs'); 

function getInitializerData(contractInterface, args) {
  const initializer = 'initialize';
  const fragment = contractInterface.getFunction(initializer);
  return contractInterface.encodeFunctionData(fragment, args);
}

async function main() {
  const [owner] = await ethers.getSigners()
  const transactionCount = await owner.getNonce()
  console.log(`Here is the deployment offline by ${owner.address}, nonce: ${transactionCount}`);

  const ARAToken = await ethers.getContractFactory("ARAToken");
  const deployTx = await ARAToken.getDeployTransaction();
  deployTx.from = owner.address;
  fs.writeFileSync("tx_ara.txt", deployTx.data); 

  console.log(deployTx.data);
  const tokenAddr = ethers.getCreateAddress({from: owner.address, nonce: transactionCount});
  console.log(`Token addr: ${tokenAddr}\n\n`);
  // Here we will use the hardhat
  const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
  const proxyAdminTx = await ProxyAdmin.getDeployTransaction(owner.address);

  fs.writeFileSync("tx_proxyadmin.txt", proxyAdminTx.data); 

  const proxyAdminAddr = ethers.getCreateAddress({from: owner.address, nonce: transactionCount + 1});

  const Proxy = await ethers.getContractFactory("TransparentUpgradeableProxy");
  const proxy = await Proxy.getDeployTransaction(
    tokenAddr,
    proxyAdminAddr,
    getInitializerData(ARAToken.interface, []),
  );
  fs.writeFileSync("tx_proxy.txt", proxy.data); 

  console.log("Done");
}

main();