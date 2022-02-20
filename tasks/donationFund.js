const { task } = require("hardhat/config");
const { parseEther } = require("ethers/lib/utils");
require("@nomiclabs/hardhat-ethers");


task("donate", "Pay donate on contract")
    .addParam("contract", "Contract address")
    .addParam("amount", "Amount donate ethers")
    .setAction(async (taskArgs, hre) => {
        const donations = await hre.ethers.getContractAt("donations", (taskArgs.contract));
        const donateTx = await donations.donationFund({
            value: parseEther(taskArgs.amount),
        });
        await donateTx.wait();

        console.log(`Successfully donated ${taskArgs.amount} ETH`);
    });

module.exports = {};

// npx hardhat donate --contract 0x118b5913fF48A8D4ee0d7b73FC01cdd368014Eb5 --amount 0.01 --network rinkeby