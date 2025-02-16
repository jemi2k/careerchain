// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserProfile {
    mapping(address => string) private profiles;

    function setProfile(string memory ipfsHash) public {
        profiles[msg.sender] = ipfsHash;
    }

    function getProfile(address user) public view returns (string memory) {
        return profiles[user];
    }
}