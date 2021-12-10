/* eslint-disable no-undef */
var ProjectChain = artifacts.require('ProjectChain');
var UserChain = artifacts.require('UserChain');
var AdminChain = artifacts.require('AdminChain');
var ServiceChain = artifacts.require('ServiceChain');
var SignatureChain = artifacts.require('SignatureChain');

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(ProjectChain);
    await deployer.deploy(UserChain);

    const username = "Beniamin Jitca";
    const role = 0;
    const walletAddress = accounts[0];

    await deployer.deploy(AdminChain);
    await AdminChain.deployed().then(async function(instance) {
        return await instance.createtAdmin(username, role, walletAddress);
    });

//     await deployer.deploy(ServiceChain);
//     await deployer.deploy(SignatureChain);
};
