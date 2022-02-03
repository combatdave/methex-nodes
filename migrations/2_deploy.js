const NodeRegistry = artifacts.require("NodeRegistry");
const UserAuth = artifacts.require("UserAuth");

module.exports = async function(deployer, network, accounts) {

    await deployer.deploy(UserAuth);
    inst_userAuth = await UserAuth.deployed()

    await deployer.deploy(NodeRegistry, inst_userAuth.address);
};