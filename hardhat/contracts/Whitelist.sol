//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

//No need to use ERC721 Standard or other imports when creating Whitelist
contract Whitelist { 

    uint8 public maxWhitelistedAddresses; //Maximum address that can be added   
    mapping(address => bool) public whitelistedAddresses;  //For every address it will identify if Whitelisted or not
    uint8 public numAddressesWhitelisted; //The total number of whitelisted addresses

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    // ! = not
    // Function to add address to whitelisted address, anyone can access it and not limited to owner
    function addAddresstoWhitelist() public {
        
        // require(if .. then proceed, or else)
        require
            (!whitelistedAddresses[msg.sender], 
            "Sender has already been whitelisted "); // To check if the sender who will call this function is already on the whitelist
        
        require
        (numAddressesWhitelisted < maxWhitelistedAddresses, 
        "More address can't be added, limit reached");
        
        whitelistedAddresses[msg.sender] = true; //To add the address if still not whitelisted and haven't reached the limit yet
        numAddressesWhitelisted += 1;
    }

}


