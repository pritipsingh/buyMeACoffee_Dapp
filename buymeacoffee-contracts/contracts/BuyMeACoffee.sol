// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log

//BuyMeACoffee deployed to: 0xf1Ec0ab9b4cBF456eA5E27D36DeA4A7bebeF72BE

contract BuyMeACoffee{

//event to emit when memo is created
    event NewMemo(
        address from,
        string message,
        uint256 timestamp,
        string name
    );

//struct to store memo
    struct Memo {
        address from;
        string message;
        uint256 timestamp;
        string name;
    }

//list of all memos received from friends
    Memo[] memos;

//address of contract deployer
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Cant buy a coffee with 0 ether");

        memos.push(Memo(
            msg.sender,
            _message,
            block.timestamp,
            _name
            )
        );
        //event a log event when a new event is created
        emit NewMemo(
            msg.sender,
            _message,
            block.timestamp,
            _name 
            );
        
    }

    function withdraw() public {
        require(owner.send(address(this).balance));
        
    }

    function getMemos() public view returns(Memo[] memory){
        return memos;
    }
}   

