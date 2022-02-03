# methex-nodes

## Requirements

* Truffle
* Angular

## API Documentation

### Network Tech Design/Implementation



* Fully P2P distributed network architecture for FPS game
    * No central servers
    * No “ownership” required in smart contracts
* Moment-to-moment gameplay network communication done by P2P network structure
    * Just as robust as dedicated-server networking
    * Used by CoD and other games
* Requires some central location for P2P nodes to be found
    * Similar to ThePirateBay for torrents
    * Traditionally on some centralized server (this is what CoD does, for example)
    * Can put this data on-chain, making it also decentralized
* P2P games/nodes register themselves on chain, creating an ERC721 NFT representing the game node
    * Includes node name, IP, and port
    * Can also include any arbitrary data needed (level name, object information, etc)
* Game clients display Node NFTs in-universe as scriptable objects
    * Can also be displayed for developers/testing as a simple server list
* Interacting with a Node NFT connects the game client using the relevant information (IP/port)
* Game nodes de-register themselves when they shut down, burning the NFT
* In order to register a game node, each wallet must be registered and authorised into the Met Hex universe
    * Provides metadata for wallets
        * Usernames
        * Profile pictures
        * Arbitrary game data, ie
            * Player level
            * XP
            * Time played
            * Friends list
            * Etc.
* Registering and authorisation creates a METHEX-AUTH non-transferrable ERC721 NFT owned by the wallet
* Each authorized wallet can have only one active game node registered at a time


### Wallet Authentication



* Wallets must be authenticated to the Met Hex system in order to interact with the underlying systems
* User authentication tokens are non-transferable ERC721 NFTs
* Using the deployed `UserAuth` contract:
    * First, call `Register(string memory name, string memory uri)`
        * Name: Username for the account
        * URI: A url for the users profile image
    * Additional methods:
        * SetURI
            * Allows the owner of tokenId to update the profile picture
        * tokenURI
            * Allows anyone to get the URI for this users profile picture
        * GetUserInfo
            * Gets full user info for a tokenId (name, uri, wallet address)
        * GetTokenId
            * Gets tokenId from a wallet
* TokenId can be calculated off-chain via:
    * tokenId = uint(keccak256(abi.encodePacked(msg.sender)));


### Node Registration



* Only wallets holding a METHEX-AUTH NFT can register a game node
* Users do not interact directly with this contract, this is hidden backend server code
* When a new world is spawned, the game client interacts with the deployed `NodeRegistry` contract:
    * Calls `RegisterNode(string memory name, string memory ip, uint port)`
        * Name: Game node name
        * IP: IP address of node for p2p connection
        * Port: Port of node for p2p connection
        * Mints a METHEX-NODE NFT to the calling wallet
    * Other clients call `NodeList()`
        * Returns a list of all Node NFTs and metadata
        * Game clients can then display these NFTs in the correct manner
    * When the game node is closed, call `RemoveNode(uint id)`
        * Removes the game node from the Node Registry
        * Burns the relevant METHEX-NODE NFT
