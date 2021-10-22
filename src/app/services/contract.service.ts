import { Injectable } from '@angular/core';
import Web3 from 'web3';

declare const window: any;

@Injectable({
    providedIn: 'root',
})
export class ContractService {
    window: any;

    constructor() {}

    private getAccounts = async () => {
        try {
            return await window.ethereum.request({ method: 'eth_accounts' });
        } catch (e) {
            return [];
        }
    };

    public openMetamask = async () => {
        window.web3 = new Web3(window.ethereum);
        let addresses = await this.getAccounts();
        console.log('service', addresses);
        if (!addresses.length) {
            try {
                addresses = await window.ethereum.enable();
            } catch (e) {
                return false;
            }
        }
        return addresses.length ? addresses[0] : null;
    };

    public Token = async () => {
        try {
            const contract = new window.web3.eth.Contract(abi, Address);
            const token = await contract.methods.Token().call();
            console.log('token', token);
            return token;
        } catch (error: any) {
            const errorMessage = error.message;
            console.log(errorMessage);
        }
    };
}

const Address = '0xf08B741073b3Cb01ef6fB3B412E71C977F276fAa';
const abi = [
    {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: '',
            },
        ],
        name: 'Token',
        type: 'event',
    },
];
