// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

//                 _     _               
//  _ __ ___   ___| |_  | |__   _____  __
// | '_ ` _ \ / _ \ __| | '_ \ / _ \ \/ /
// | | | | | |  __/ |_  | | | |  __/>  < 
// |_| |_| |_|\___|\__| |_| |_|\___/_/\_\
//                                       
//  Met Hex Node Registry
//
// Contract - https://t.me/geimskip

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./UserAuth.sol";


struct Node {
    uint id;
    address owner;
    string name;
    string ip;
    uint port;

    uint _time;
    uint _index;
}

struct NodeMetaData {
    mapping(string => string) string_data;
    mapping(string => int) int_data;
}



contract NodeRegistry is ERC721 {
    event NodeAdded(uint indexed id);
    event NodeRemoved(uint indexed id);

    uint _total;

    UserAuth _playerAuth;
    mapping(uint => Node) _nodes;
    mapping(uint => NodeMetaData) _metadata;
    uint[] _serverIDs;

    constructor(UserAuth playerAuth) ERC721("MetHex Node", "METHEX-NODE") {
        _playerAuth = playerAuth;
    }

    modifier authed () {
        require(_playerAuth.balanceOf(msg.sender) == 1);
        _;
    }

    function RegisterNode(string memory name, string memory ip, uint port) external authed returns (uint) {
        require(balanceOf(msg.sender) == 0);

        uint id = ++_total;
        Node storage node = _nodes[id];
        _serverIDs.push(id);
        _safeMint(msg.sender, id);

        node.id = id;
        node.owner = msg.sender;
        node.name = name;
        node.ip = ip;
        node.port = port;

        node._index = _serverIDs.length - 1;
        node._time = block.timestamp;

        emit NodeAdded(id);

        return id;
    }


    function RemoveNode(uint id) external authed {
        require (ownerOf(id) == msg.sender);

        // Get the array index
        uint _index = _nodes[id]._index;
        // Put the last element into that slot
        _serverIDs[_index] = _serverIDs[_serverIDs.length - 1];
        // Delete the last element
        _serverIDs.pop();

        // Update the array index of the serverid that got moved
        uint movedId = _serverIDs[_index];
        _nodes[movedId]._index = _index;

        // Delete the actual Node entry
        delete _nodes[id];

        // Burn the Node NFT
        _burn(id);

        emit NodeRemoved(id);
    }


    function KeepAlive(uint id) external authed {
        require (ownerOf(id) == msg.sender);
        _nodes[id]._time = block.timestamp;
    }


    function NodeIdList() external view returns (uint[] memory) {
        return _serverIDs;
    }


    function NodeList()  external view returns (Node[] memory) {
        uint num_nodes = _serverIDs.length;
        Node[] memory nodes = new Node[](num_nodes);

        for (uint i=0; i<_serverIDs.length; i++) {
            nodes[i] = _nodes[_serverIDs[i]];
        }
        return nodes;
    }


    function GetNode(uint id) external view returns (Node memory) {
        return _nodes[id];
    }


    function SetMetadata_String(uint nodeid, string calldata key, string memory value) external {
        _metadata[nodeid].string_data[key] = value;
    }


    function GetMetadata_String(uint nodeid, string calldata key) external view returns (string memory) {
        return _metadata[nodeid].string_data[key];
    }


    function SetMetadata_Int(uint nodeid, string calldata key, int value) external {
        _metadata[nodeid].int_data[key] = value;
    }


    function GetMetadata_Int(uint nodeid, string calldata key) external view returns (int) {
        return _metadata[nodeid].int_data[key];
    }
}
