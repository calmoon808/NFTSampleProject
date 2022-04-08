// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

import { Base64 } from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NewEpicNFTMinted(address sender, uint256 tokenId);

    // pass the name of NFT token and its symbol
    constructor() ERC721 ("SquareNFT", "SQUARE") {
        console.log("MyEpicNFT contract deployed!");
    }

    function makeAnEpicNFT(string memory ipfsLink) public {
        // get current tokenId, starts at 0
        uint256 newItemId = _tokenIds.current();
        require(newItemId < 50, "Can't mint for than 50 NFT's");

        // mint the NFT to the sender using msg.sender
        _safeMint(msg.sender, newItemId);

        // Set the NFT's data
        _setTokenURI(newItemId, ipfsLink);
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

        // Increment counter for next NFT to be minted
        _tokenIds.increment();

        emit NewEpicNFTMinted(msg.sender, newItemId);
    }

    function getTotalNFTsMintedSoFar() view public returns (uint256) {
        return _tokenIds.current();
    }
}