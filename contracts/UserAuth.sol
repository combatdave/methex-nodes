// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

//                 _     _               
//  _ __ ___   ___| |_  | |__   _____  __
// | '_ ` _ \ / _ \ __| | '_ \ / _ \ \/ /
// | | | | | |  __/ |_  | | | |  __/>  < 
// |_| |_| |_|\___|\__| |_| |_|\___/_/\_\
//                                       
//  Met Hex User Authentication
//
// Contract - https://t.me/geimskip

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


struct User {
    address owner;
    string name;
    string uri;
}


contract UserAuth is ERC721 {
    mapping(uint => User) _users;


    constructor() ERC721("MetHex Auth", "METHEX-AUTH") {
    }


    function Register(string memory name, string memory uri) external returns (uint tokenId) {
        require(balanceOf(msg.sender) == 0);
        tokenId = uint(keccak256(abi.encodePacked(msg.sender)));
        _safeMint(msg.sender, tokenId);

        User storage user = _users[tokenId];
        user.owner = msg.sender;
        user.name = name;
        user.uri = uri;
    } 


    function _beforeTokenTransfer(
        address from,
        address, //to,
        uint256 //tokenId
    ) internal pure override {
        require(from == address(0));
    }


    function SetURI(uint256 tokenId, string memory uri) external {
        require(ownerOf(tokenId) == msg.sender);
        _users[tokenId].uri = uri;
    }


    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _users[tokenId].uri;
    }

    function GetTokenId(address account) external pure returns (uint tokenId) {
        tokenId = uint(keccak256(abi.encodePacked(account)));
    }

    function GetUserInfo(uint256 tokenId) external view returns (User memory) {
        return _users[tokenId];
    }
}