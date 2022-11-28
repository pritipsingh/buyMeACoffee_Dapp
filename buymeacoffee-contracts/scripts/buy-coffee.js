
const hre = require("hardhat");

// Returns the Ether balance of a given address.
  const getBalance = async (address) => {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
  }
// Logs the Ether balances for a list of addresses.
  const printBalances = async (addresses) => { 
    indx = 0;
    for (const address of addresses ) {
      console.log(`Address ${indx} balance:`, await getBalance(address));
    indx++;
    }
    
  }
// Logs the memos stored on-chain from coffee purchases.
  const printMemos = async (memos) => {
    for (const memo of memos){
      const timestamp = memo.timestamp;
      const tipper = memo.name;
      const tipperAddress = memo.from;
      const message = memo.message;

      console.log(`At ${timestamp}, ${tipper} sent a message from ${tipperAddress} saying ${message}`);
    }
  }

async function main() {
  // Get the example accounts we'll be working with.
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();
  
   // We get the contract to deploy.
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
   // Deploy the contract.
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to:", buyMeACoffee.address);
   
   // Check balances before the coffee purchase.
   const addresses = [owner.address, tipper1.address, buyMeACoffee.address];
  console.log("==start==")

  await printBalances(addresses);


  // Buy the owner a few coffees.
  // await buyMeACoffee.buyCoffee("")
  const tip = {value : hre.ethers.utils.parseEther('1')};
  await buyMeACoffee.connect(tipper1).buyCoffee("Divu" , "Thanks for the great content", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Priti" , "You're the best", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("chammu" , "Thanks for the great content and code", tip);

  
  // Check balances after the coffee purchase.
  console.log("==After the coffee==")
  await printBalances(addresses);

  // Withdraw.
  await buyMeACoffee.connect(owner).withdraw();

  // Check balances after withdrawal.
  console.log("==After the withdrawal==");
  await printBalances(addresses);

  // Check out the memos.
  console.log("==Memos==");
  const memos = await buyMeACoffee.getMemos();
  await printMemos(memos);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
