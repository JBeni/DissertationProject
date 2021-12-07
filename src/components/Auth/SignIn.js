import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Toaster } from 'react-hot-toast';
import * as toasterService from '../Services/toasterService';
import { Button } from '@material-ui/core';

export default function SignIn(props) {
    const { signInFunction } = props;

	const handleSubmit = () => {
        let userPrivateKey = prompt("Enter your private key");
        if (userPrivateKey === null) {
            toasterService.notifyToastError('Valid Private KEY required to sign the transaction.');
            return;
        }

        let addressFromPrivateKey = null;
        try {
            addressFromPrivateKey = props.web3.eth.accounts.privateKeyToAccount("0x" + userPrivateKey);
        } catch (error) {
            toasterService.notifyToastError('Valid Private KEY required to sign the transaction.');
            userPrivateKey = null;
            return;
        }

        if (addressFromPrivateKey !== null) {
            signInFunction(addressFromPrivateKey.address);
        }
	};

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box>
                        <Button
                            style={{ marginBottom: '10px', marginTop: '-25px', width: '150px', height: '80px' }}
                            variant="contained"
                            size="large"
                            color="primary"
                            onClick={ () => handleSubmit() }
                        >Sign In</Button>
                    </Box>
                </Box>
            </Container>

            <Toaster position="bottom-center" reverseOrder={false} />
        </>
    );
}
