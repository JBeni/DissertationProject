/* eslint-disable no-undef */
const ProjectChain = artifacts.require('ProjectChain');
const AdminChain = artifacts.require('AdminChain');
const ServiceChain = artifacts.require('ServiceChain');

const Web3 = require('web3');

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(ProjectChain);

    const web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));

    // The addresses are from Ganache Local Environment
    await ProjectChain.deployed().then(async function(instance) {
        await instance.registerUser(web3.utils.utf8ToHex("User"), web3.utils.utf8ToHex("Project 1"), 1, "0x66bD46f7d64afE0c40C6e70175702Ef72faab94A");
        await instance.registerUser(web3.utils.utf8ToHex("Company"), web3.utils.utf8ToHex("Builder 1"), 2, "0xE11eEAb750439A716534bE0479a2fD9248454600");
        await instance.registerUser(web3.utils.utf8ToHex("Supervisor"), web3.utils.utf8ToHex("Project 1"), 3, "0x686d54a3b6B30db5AC94f97563d061dD09b8A2B2");

        await instance.registerUser(web3.utils.utf8ToHex("User"), web3.utils.utf8ToHex("Project 2"), 1, "0xC0111987DC4C4cE4F4BE6b6B63b133a82d45CC0C");
        await instance.registerUser(web3.utils.utf8ToHex("Company"), web3.utils.utf8ToHex("Builder 2"), 2, "0x454875eC12BaB85825BC9e43b95F59f48a4467C8");
        await instance.registerUser(web3.utils.utf8ToHex("Supervisor"), web3.utils.utf8ToHex("Project 2"), 3, "0x0c42e7a66Aa6931a6443b90e70d2F60B27545031");
    });


    const firstname = "Beniamin";
    const lastname = "Jitca";
    const role = 0;
    const walletAddress = accounts[0];

    await deployer.deploy(AdminChain);
    await AdminChain.deployed().then(async function(instance) {
        await instance.createtAdmin(firstname, lastname, role, walletAddress);
    });

    await deployer.deploy(ServiceChain);
};
