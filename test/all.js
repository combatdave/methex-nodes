const NodeRegistry = artifacts.require("NodeRegistry");
const UserAuth = artifacts.require("UserAuth");


function GetReturnVals(tx) {
    return tx.receipt.logs[0].args;
}


async function RegisterNode(name, ip, port, params) {
    let inst_noderegistry = await NodeRegistry.deployed();
    let tx = await inst_noderegistry.RegisterNode.sendTransaction(name, ip, port, params);
    let server_id = GetReturnVals(tx).tokenId;
    console.log("Registered server with ID", server_id.toString());
    return server_id
}


contract("NodeRegistry", async accounts => {
    it("tests URI", async() => {
        let inst_playerauth = await UserAuth.deployed();
        let inst_noderegistry = await NodeRegistry.deployed();

        await inst_playerauth.Register.sendTransaction("Willard Smith", "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.imdb.com%2Fname%2Fnm0000226%2F&psig=AOvVaw2om6nbvkbhAeAVyw5FmMy0&ust=1643206767887000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCPjlorCMzfUCFQAAAAAdAAAAABAD", { from: accounts[0] });
        await inst_playerauth.Register.sendTransaction("Poop", "", { from: accounts[1] });

        server_1 = await RegisterNode("My server 1", "192.168.0.1", 5555, { from: accounts[0] });
        server_2 = await RegisterNode("Server 2", "2.2.2.2", 1234, { from: accounts[1] });

        let servers = await inst_noderegistry.NodeList.call();
        // console.log(servers);

        server_2_info = await inst_noderegistry.GetNode.call(server_2);
        console.log(server_2_info);

        await inst_noderegistry.RemoveNode.sendTransaction(server_1, { from: accounts[0] });

        server_2_info = await inst_noderegistry.GetNode.call(server_2);
        console.log(server_2_info);
    });
});