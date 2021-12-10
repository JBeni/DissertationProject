
const verifySignatureTest = async (props, _projectAddress, _signerAddress, _signature) => {
    const v = '0x' + _signature.slice(130, 132).toString();
    const r = _signature.slice(0, 66).toString();
    const s = '0x' + _signature.slice(66, 130).toString();
    const messageHash = props.web3.eth.accounts.hashMessage(_projectAddress);

    const verificationOutput = await props.signatureChain.methods
        .verifySignature(_signerAddress, messageHash, v, r, s)
        .call({ from: this.props.account });

    if (verificationOutput) {
        alert('Signer Address is verified successfully!');
    } else {
        alert('Signer Address is not verified!');
    }
}

