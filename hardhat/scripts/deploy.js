const hre = require("hardhat");

async function main() {
    const whitelistContract = await hre.ethers.getContractFactory("Whitelist");
    const deployedWhitelistContract = await whitelistContract.deploy(20); //E.g. deploy whitelistContract and then will be stored on deployedWhitelistContract 
    await deployedWhitelistContract.deployed();

    console.log("This is the object for:", deployedWhitelistContract)
    console.log("Contract deployed to:", deployedWhitelistContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })

  // Contract deployed to: 0x03341d385486881513Aa9b25B01fac4A9Cf2C729