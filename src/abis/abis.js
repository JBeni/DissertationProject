export const uDonate_address = "0xA11e73F851C12d8d25a7b88a6121AD365De1838c";
export const uDonate_abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_registry",
                type: "address",
            },
            {
                internalType: "address",
                name: "_causeRegistry",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
        ],
        name: "CreateOrganization",
        type: "event",
    },
];
