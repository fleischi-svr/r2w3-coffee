// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");


// Return the Ether balance of a given address
async function getBalance(address){
  const balanceBigInt = await hre.waffle.provider.getBalance(address); // provider => interacts as node
  return hre.ethers.utils.formatEther(balanceBigInt);
}

//Logs the Ether balances for a list of addresses
async function printBalances(addresses){
  let idx = 0;
  for(const address of addresses){
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

//Logs the momos stored on chain from coffee purchases
async function printMemos(memos){
  for (const memo of memos){
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said : "${message}"`);
  }
}


// VS Code snippets: 
// strg + enter => new line under current line
// strg + shift + enter => new line above current line

async function main() {
  // Get example accounts.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
  console.log(owner.addre);

  // Get the contract & contract instance & deploy instance
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to ", buyMeACoffee.address);
  
  // Check balances before the coffee purchases
  const addresses = [owner.address, tipper.address, buyMeACoffee.address, "0x76BB18fdcE84e8675a3B838f3B8fD2288A58F31f"];
  console.log("== start == ");
  await printBalances(addresses);

  // Buy the owner a few coffees
  const tip = {value: hre.ethers.utils.parseEther("1")}
  await buyMeACoffee.connect(tipper).buyCoffee("Simi","mir is fad",tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Wurm","BnS is schlecht",tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Richi","Nice PoK NFT",tip);

  // Check balances after coffee purchase
  console.log("== bought coffee ==");
  await printBalances(addresses);

  // Change owner
  console.log("== changing owner ==");
  await buyMeACoffee.connect(owner).updateOwner("0x76BB18fdcE84e8675a3B838f3B8fD2288A58F31f");

  // Withdraw funds.
  
  await buyMeACoffee.connect(owner).withdrawTips();

  // Check balance after withdraw
  console.log("== after withdraw tips ==");
  await printBalances(addresses);

  //Read all the memos written on chain
  console.log("== printing memos ==");
  printMemos(await buyMeACoffee.getMemos());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
