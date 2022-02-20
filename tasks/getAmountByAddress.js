const { task } = require("hardhat/config");
const { formatEther } = require("ethers/lib/utils");
require("@nomiclabs/hardhat-ethers");


task("amountByAddress", "Get amount of donation by address")
    .addParam("contract", "Contract address")
    .addParam("address", "Adrress for get amount of their donation")
    .setAction(async (taskArgs, hre) => {
        const donations = await hre.ethers.getContractAt("donations", (taskArgs.contract));
        const getAmount = await donations.amountByAddress(taskArgs.address);
        console.log(`${taskArgs.address} donated ${formatEther(getAmount)} ETH`);
    });

module.exports = {};

// npx hardhat amountByAddress --contract 0x118b5913fF48A8D4ee0d7b73FC01cdd368014Eb5 --address 0xB79cA96C0F63924320C69e5907006dbE5ca7adE6 --network rinkeby