const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
    const [signer] = await ethers.getSigners();

    const Donations = await ethers.getContractFactory("donations", signer);
    const donations = await Donations.deploy();
    await donations.deployed();
    console.log(donations.address);
}

main() // npx hardhat run scripts/deploy.js --network rinkeby
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
