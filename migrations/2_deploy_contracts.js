/* eslint-disable no-undef */
const ProjectChain = artifacts.require('ProjectChain');
const UserChain = artifacts.require('UserChain');
const AdminChain = artifacts.require('AdminChain');
const ServiceChain = artifacts.require('ServiceChain');
const SignatureChain = artifacts.require('SignatureChain');

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

    await deployer.deploy(ServiceChain);
    await deployer.deploy(SignatureChain);
};
