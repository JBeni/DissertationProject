/* eslint-disable no-undef */
var ProjectChain = artifacts.require('ProjectChain');
var AdminChain = artifacts.require('AdminChain');
var ServiceChain = artifacts.require('ServiceChain');

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(ProjectChain);

    const username = "Beniamin Jitca";
    const role = 0;
    const walletAddress = accounts[0];

    await deployer.deploy(AdminChain);
    await AdminChain.deployed().then(function(instance) {
        return instance.createtAdmin(username, role, walletAddress);
    });

    await deployer.deploy(ServiceChain);
    // await ServiceChain.deployed().then(function(instance) {
    //     return instance.createDropdowns();
    // });
};
