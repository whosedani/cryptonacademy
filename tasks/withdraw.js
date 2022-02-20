const { task } = require("hardhat/config");
const { parseEther } = require("ethers/lib/utils");
require("@nomiclabs/hardhat-ethers");


task("withdraw", "Withdrawal from contract to any address")
    .addParam("contract", "Contract address")
    .addParam("amount", "Amount donate ethers")
    .addParam("address", "Address for withdraw")
    .setAction(async (taskArgs, hre) => {
        const donations = await hre.ethers.getContractAt("donations", (taskArgs.contract));
        const withdraw = await donations.donationWithdraw(taskArgs.address, parseEther(taskArgs.amount));
        await withdraw.wait();

        console.log(`Successfully withdraw ${taskArgs.amount} ETH to ${taskArgs.address}`);
    });

module.exports = {};

// npx hardhat withdraw --contract 0x118b5913fF48A8D4ee0d7b73FC01cdd368014Eb5 --amount 0.01 --address 0xB79cA96C0F63924320C69e5907006dbE5ca7adE6 --network rinkeby