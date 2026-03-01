require('dotenv').config();
const { Web3 } = require('web3');
const floppyAbi = require('../artifacts/contracts/Token.sol/Floppy.json').abi;
const floppyAddress = "0xB3A7333639dEc908c4938bB625A5Ee8C2272e828"
myPrivateKey = "0x" + process.env.SEPOLIA_PRIVATE_KEY;
myAddress = "0xf1d288fCB37FaB425Fe507fCb5c4Fe498D5a3909";
receiverAddress = "0xE5746CC35Ac26608EB587f91e7311225556830A5";

async function interact() {
    web3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');
    floppyContract = await new web3.eth.Contract(floppyAbi, floppyAddress);

    //// Call functions from contract: Call, send
    /// Call: read data from blockchain (no gas fee)
    // myBalance = await floppyContract.methods.balanceOf(myAddress).call();
    // console.log("My Floppy token balance is: " + myBalance);
    /// Send: write data to blockchain (requires gas fee)
    /// transfer tokens

    await web3.eth.accounts.wallet.add(myPrivateKey);
    reveiverBalanceBefore = await floppyContract.methods.balanceOf(receiverAddress).call();

    rs = await floppyContract.methods.transfer(receiverAddress, 10).send({ from: myAddress, gas: 300000 });

    reveiverBalanceAfter = await floppyContract.methods.balanceOf(receiverAddress).call();

    console.log(rs);
    console.log("Receiver balance before transfer: " + reveiverBalanceBefore);
    console.log("Receiver balance after transfer: " + reveiverBalanceAfter);
}
interact();