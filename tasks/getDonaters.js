const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-ethers");


task("getDonaters", "Getting all donation addreses")
    .addParam("contract", "Contract address")
    .setAction(async (taskArgs, hre) => {
        const donations = await hre.ethers.getContractAt("donations", (taskArgs.contract));
        const getArray = await donations.allDonationsAddreses();
        console.log(getArray);
    });

module.exports = {};

// npx hardhat getDonaters --contract 0x118b5913fF48A8D4ee0d7b73FC01cdd368014Eb5 --network rinkeby