const hre = require("hardhat");
const ethers = hre.ethers;
const donationsArtifact = require('../artifacts/contracts/donations.sol/donations.json');

async function currentBalance(address, msg = '') {
    const balance = await ethers.provider.getBalance(address);
    console.log(msg, await ethers.utils.formatEther(balance), 'ETH');
};

async function main() {
    const [signer, acc1, acc2, acc3] = await ethers.getSigners();
    const contractAddress = '0x118b5913fF48A8D4ee0d7b73FC01cdd368014Eb5';

    async function fund(_account) {     // donationFund function
        const donationsContract = new ethers.Contract(
            contractAddress,
            donationsArtifact.abi,
            _account
        )

        console.log('funding')
        await currentBalance(contractAddress, 'contract balance before is:');
        await currentBalance(_account.address, 'account balance before is:');

        const fund = await donationsContract.donationFund({ value: ethers.utils.parseEther('0.01') })
        await fund.wait()

        console.log('tx done');
        await currentBalance(contractAddress, 'contract balance after is:');
        await currentBalance(_account.address, 'account balance after is:');
        console.log('')
    };

    async function amountByAddress(_account) {     // amountByAddress functions
        const donationsContract = new ethers.Contract(
            contractAddress,
            donationsArtifact.abi,
            signer
        )

        const getAmount = await donationsContract.amountByAddress(_account);
        console.log(ethers.utils.formatEther(getAmount), 'ETH');
    };

    async function donatorsArray() {    // allDonationsAddreses function
        const donationsContract = new ethers.Contract(
            contractAddress,
            donationsArtifact.abi,
            signer
        )

        const getArray = await donationsContract.allDonationsAddreses();
        console.log(getArray);
    };

    async function withdraw(addressForWithdraw, amountInEth) {     // donationWithdraw function
        const donationsContract = new ethers.Contract(
            contractAddress,
            donationsArtifact.abi,
            signer
        )
        await currentBalance(contractAddress, 'contract balance before is:');
        await currentBalance(addressForWithdraw, 'account balance before is:');

        const withdr = await donationsContract.donationWithdraw(addressForWithdraw, ethers.utils.parseEther(amountInEth));
        await withdr.wait();
        console.log('tx done');

        await currentBalance(contractAddress, 'contract balance after is:');
        await currentBalance(addressForWithdraw, 'account balance after is:');
        console.log('')
    }

    // LOCALHOST EXAMPLE

    // fundung contract with 3 accs for 1 eth each:
    console.log('1) fundung contract with 3 accs for 1 eth each:')
    await fund(signer);
    await fund(acc1);
    await fund(acc2);

    // get array of donators
    console.log('2) geting array of donators:')
    await donatorsArray();
    console.log('')

    // get amount of their donation:
    console.log('3) getting amount of their donation:')
    await amountByAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    await amountByAddress('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
    await amountByAddress('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC');
    console.log('')

    // withdraw from contract to these accs:
    console.log('4) withdrawing from contract to these accs:')
    await withdraw('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '1');
    await withdraw('0x70997970C51812dc3A010C7d01b50e0d17dc79C8', '0.5');
    await withdraw('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', '2');
}


main() // npx hardhat run scripts\main.js --network localhost
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
