const hre = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect } = chai;


describe("Donations contract", function () {
    let donations;
    let Donations;
    let owner;
    let acc1;
    let acc2;
    let donationsAddress;

    beforeEach(async function () {
        Donations = await ethers.getContractFactory("donations");
        donations = await Donations.deploy();
        await donations.deployed();
        donationsAddress = donations.address;
        [owner, acc1, acc2] = await ethers.getSigners();
    });

    describe("Deploy", async function () {
        it("Should set the right owner", async function () {
            expect(await donations.owner()).to.equal(owner.address);
        });
    });

    describe("Functions", async function () {
        it("Fund contract with two accs and compare to recent balances", async function () {
            const ownerBalanceBefore = await ethers.utils.formatEther(await ethers.provider.getBalance(owner.address));
            const acc1BalanceBefore = await ethers.utils.formatEther(await ethers.provider.getBalance(acc1.address));
            const contractBalanceBefore = await ethers.utils.formatEther(await ethers.provider.getBalance(donationsAddress))
            expect(contractBalanceBefore).to.equal("0.0");

            const fund = await donations.connect(owner).donationFund({ value: ethers.utils.parseEther('1') })
            await fund.wait()

            const fund2 = await donations.connect(acc1).donationFund({ value: ethers.utils.parseEther('2') })
            await fund2.wait()

            const ownerBalanceAfter = await ethers.utils.formatEther(await ethers.provider.getBalance(owner.address));
            const acc1BalanceAfter = await ethers.utils.formatEther(await ethers.provider.getBalance(acc1.address));
            const contractBalanceAfter = await ethers.utils.formatEther(await ethers.provider.getBalance(donationsAddress));
            expect(contractBalanceAfter).to.equal("3.0");
            expect(ownerBalanceBefore < ownerBalanceAfter);
            expect(acc1BalanceBefore < acc1BalanceAfter);
        });

        it("Should return the right amount of donations by accounts (three accs)", async function () {
            const fund1 = await donations.connect(owner).donationFund({ value: ethers.utils.parseEther('1') })
            await fund1.wait()
            const getAmount1 = await donations.connect(owner).amountByAddress(owner.address);
            expect(ethers.utils.formatEther(getAmount1)).to.equal('1.0');

            const fund2 = await donations.connect(acc1).donationFund({ value: ethers.utils.parseEther('3.5') })
            await fund2.wait()
            const getAmount2 = await donations.connect(acc1).amountByAddress(acc1.address);
            expect(ethers.utils.formatEther(getAmount2)).to.equal('3.5');

            const fund3 = await donations.connect(acc2).donationFund({ value: ethers.utils.parseEther('5.2') })
            await fund3.wait()
            const getAmount3 = await donations.connect(acc2).amountByAddress(acc2.address);
            expect(ethers.utils.formatEther(getAmount3)).to.equal('5.2');
        });

        it("Should get the right array of donators (three accs)", async function () {
            const fund1 = await donations.connect(owner).donationFund({ value: ethers.utils.parseEther('1') })
            await fund1.wait()
            const getArray1 = await donations.connect(owner).allDonationsAddreses();
            expect(getArray1).to.deep.equal([
                owner.address
            ]);

            const fund2 = await donations.connect(acc1).donationFund({ value: ethers.utils.parseEther('3.5') })
            await fund2.wait()
            const getArray2 = await donations.connect(acc1).allDonationsAddreses();
            expect(getArray2).to.deep.equal([
                owner.address, acc1.address
            ]);

            const fund3 = await donations.connect(acc2).donationFund({ value: ethers.utils.parseEther('5.2') })
            await fund3.wait()
            const getArray3 = await donations.connect(acc2).allDonationsAddreses();
            expect(getArray3).to.deep.equal([
                owner.address, acc1.address, acc2.address
            ]);
        });

        it("Should withdraw from owner acc to two accounts", async function () {
            const ownerBalanceBefore = await ethers.utils.formatEther(await ethers.provider.getBalance(owner.address));
            const contractBalanceBefore = await ethers.utils.formatEther(await ethers.provider.getBalance(donationsAddress))
            expect(contractBalanceBefore).to.equal("0.0");

            const fund1 = await donations.connect(owner).donationFund({ value: ethers.utils.parseEther('1') })
            await fund1.wait()
            const contractBalanceMid = await ethers.utils.formatEther(await ethers.provider.getBalance(donationsAddress))
            const ownerBalanceMid = await ethers.utils.formatEther(await ethers.provider.getBalance(owner.address));
            expect(contractBalanceMid).to.equal("1.0");
            expect(ownerBalanceBefore < ownerBalanceMid);

            const withdr1 = await donations.connect(owner).donationWithdraw(owner.address, ethers.utils.parseEther('1'));
            await withdr1.wait();
            const contractBalanceAfter = await ethers.utils.formatEther(await ethers.provider.getBalance(donationsAddress))
            const ownerBalanceAfter = await ethers.utils.formatEther(await ethers.provider.getBalance(owner.address));
            expect(contractBalanceAfter).to.equal("0.0");
            expect(ownerBalanceMid > ownerBalanceAfter);
            expect(contractBalanceAfter == contractBalanceBefore);


            const acc1BalanceBefore = await ethers.utils.formatEther(await ethers.provider.getBalance(acc1.address));
            const contractBalanceBefore2 = await ethers.utils.formatEther(await ethers.provider.getBalance(donationsAddress))
            expect(contractBalanceBefore2).to.equal("0.0");

            const fund2 = await donations.connect(owner).donationFund({ value: ethers.utils.parseEther('3') })
            await fund2.wait()
            const contractBalanceMid2 = await ethers.utils.formatEther(await ethers.provider.getBalance(donationsAddress))
            const acc1BalanceMid = await ethers.utils.formatEther(await ethers.provider.getBalance(acc1.address));
            expect(contractBalanceMid2).to.equal("3.0");
            expect(acc1BalanceBefore < acc1BalanceMid);

            const withdr2 = await donations.connect(owner).donationWithdraw(acc1.address, ethers.utils.parseEther('3'));
            await withdr2.wait();
            const contractBalanceAfter2 = await ethers.utils.formatEther(await ethers.provider.getBalance(donationsAddress))
            const acc1BalanceAfter = await ethers.utils.formatEther(await ethers.provider.getBalance(acc1.address));
            expect(contractBalanceAfter2).to.equal("0.0");
            expect(acc1BalanceMid > acc1BalanceAfter);
            expect(contractBalanceAfter2 == contractBalanceBefore2);
        });

        it("Shouldn't withdraw with other accs excepts owner acc", async function () {
            const fund1 = await donations.connect(owner).donationFund({ value: ethers.utils.parseEther('1') });
            await fund1.wait();
            await expect((donations.connect(acc1).donationWithdraw(acc1.address, ethers.utils.parseEther('1')))).to.be.revertedWith("Not an owner");

            const fund2 = await donations.connect(owner).donationFund({ value: ethers.utils.parseEther('3') });
            await fund2.wait();
            await expect((donations.connect(acc2).donationWithdraw(acc2.address, ethers.utils.parseEther('3')))).to.be.revertedWith("Not an owner");
        });

        it("Donation shouldn't be zero", async function () {
            expect(donations.connect(owner).donationFund({ value: ethers.utils.parseEther('0') })).to.be.revertedWith("Not less then zero");
        });
    });
});