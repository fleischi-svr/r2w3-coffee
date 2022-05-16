//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
// this has been deployed to : 0x14824D288aCc97899d34F94923b5F4e0c2382402
// sec deploy : 0x8Cc37F170DE5033dA63d028E38bE5dDB64dB6AF4

contract BuyMeACoffee {
    // Event to emit when a Memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct.
    struct Memo{
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all memos reveived from friends
    Memo[] memos;

    // address of the contract deployer
    address payable owner;

    // Deploy logic
    constructor(){
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a coffee for contract owner
     * @param _name name of the coffee buyer
     * @param _message a nice message from the coffee buyer
     */
    function buyCoffee(string memory _name, string memory _message) public payable{
        require(msg.value > 0, "can't buy coffe with 0 eth");

        // Add memo to storage
        memos.push(Memo(msg.sender,block.timestamp,_name,_message));

        // Emit a log event when momo is created
        emit NewMemo(msg.sender,block.timestamp,_name,_message);

    }

    /**
     * @dev send the entire balance from Contract to owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev fetch all memos stored on the blockchain
     */
    function getMemos() public view returns(Memo[] memory){
        return memos;
    }

    /**
     * @dev changes owner of contract
     */
    function updateOwner(address newOwner) public{
        require(msg.sender==owner);
        owner = payable(newOwner);
    }
}
