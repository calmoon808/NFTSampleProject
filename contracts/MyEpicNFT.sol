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

    string firstHalfSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: ";
    string secondHalfSvg = "; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] colors = ["red", "blue", "grey", "yellow", "green", "purple", "orange", "brown"];
    string[] firstWords = ["Big", "Fat", "Small", "Tall", "Beautiful", "Enlightened", "Weak", "Delicious", "Hard", "Soft", "Fancy", "Smelly", "Disgusting", "Phallic", "Speedy", "Tantalizing", "Sultry"];
    string[] secondWords = ["Stinging", "Twirling", "Diving", "Melting", "Sinking", "Dipping", "Fucking", "Waving", "Fighting", "Falling", "Laughing", "Sulking", "Dreaming", "Pissing", "Rolling"];
    string[] thirdWords = ["Octopus", "Tree", "Cloud", "Monster", "Beetle", "Bard", "Yeetus", "Danger", "Whirlpool", "Boulder", "Avalanche", "Jello", "Stingray", "Buddha", "Dog", "Ferret", "Trash"];

    event NewEpicNFTMinted(address sender, uint256 tokenId);

    // pass the name of NFT token and its symbol
    constructor() ERC721 ("SquareNFT", "SQUARE") {
        console.log("MyEpicNFT contract deployed!");
    }

    function pickRandomColor(uint256 tokenId) public view returns (string memory) {
        // seed random generator
        uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
        rand = rand % colors.length;
        return colors[rand];
    }

    function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
        // seed random generator
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
        // seed random generator
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
        // seed random generator
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function makeAnEpicNFT() public {
        // get current tokenId, starts at 0
        uint256 newItemId = _tokenIds.current();
        require(newItemId < 50, "Can't mint for than 50 NFT's");
        string memory baseSvg = string(abi.encodePacked(firstHalfSvg, pickRandomColor(newItemId), secondHalfSvg));
        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(abi.encodePacked(first, second, third));
        string memory finalSvg = string(abi.encodePacked(baseSvg, combinedWord, "</text></svg>"));

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "', combinedWord,
                        '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                        // add data:image/svg+xml;base64 and then append our base64 encode our svg
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        // mint the NFT to the sender using msg.sender
        _safeMint(msg.sender, newItemId);

        // Set the NFT's data
        _setTokenURI(newItemId, finalTokenUri);
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

        // Increment counter for next NFT to be minted
        _tokenIds.increment();

        emit NewEpicNFTMinted(msg.sender, newItemId);
    }

    function getTotalNFTsMintedSoFar() view public returns (uint256) {
        return _tokenIds.current();
    }
}