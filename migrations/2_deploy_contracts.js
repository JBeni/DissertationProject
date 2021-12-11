/* eslint-disable no-undef */
const ProjectChain = artifacts.require('ProjectChain');
const UserChain = artifacts.require('UserChain');
const AdminChain = artifacts.require('AdminChain');
const ServiceChain = artifacts.require('ServiceChain');

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(ProjectChain);
    await deployer.deploy(UserChain);

    const firstname = "Jitca";
    const lastname = "Jitca";
    const role = 0;
    const walletAddress = accounts[0];

    await deployer.deploy(AdminChain);
    await AdminChain.deployed().then(async function(instance) {
        return await instance.createtAdmin(firstname, lastname, role, walletAddress);
    });

    await deployer.deploy(ServiceChain);
};
