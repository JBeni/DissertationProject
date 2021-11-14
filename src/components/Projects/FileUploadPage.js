import React, { useState } from 'react';
import './FileUploadPage.css';
const axios = require('axios');

export default function FileUploadPage() {
	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
    };

	const handleSubmission = async () => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        let data = new FormData();
        data.append('file',  selectedFile, selectedFile.name);
        const metadata = JSON.stringify({
            name: selectedFile.name,
            type: selectedFile.type,
            sizeBytes: selectedFile.size,
            lastModifiedDate: selectedFile.lastModifiedDate
        });
        data.append('pinataMetadata', metadata);

        axios.post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data`,
                pinata_api_key: '1faa0621e9811fe94cc5',
                pinata_secret_api_key: '67d8757af6298b4feb8fedcb943efdd93a41450b2061427b4c1d1506386c5455'
            }
        }).then(function (response) {
        }).catch(function (error) {});
    };



    const userPinList = () => {
        let queryString = '?';
        // queryString = queryString + `hashContains=${queryParams.hashContains}&`;
        // queryString = queryString + `status=${queryParams.selectedPinStatus}&`;
        // queryString = queryString + `metadata[name]=${queryParams.nameContains}&`;
        // const stringKeyValues = JSON.stringify(queryParams.keyvalues);
        // queryString = queryString + `metadata[keyvalues]=${stringKeyValues}`;

        const url = `https://api.pinata.cloud/data/pinList${queryString}`;
        axios
            .get(url, {
                headers: {
                    pinata_api_key: '1faa0621e9811fe94cc5',
                    pinata_secret_api_key: '67d8757af6298b4feb8fedcb943efdd93a41450b2061427b4c1d1506386c5455'
                }
            }).then(function (response) {
                console.log(response);
            }).catch(function (error) {});
    };


	return (
		<div>
            <label className="file">
                <input type="file" name="file" onChange={changeHandler} />
                <span className="file-custom"></span>
            </label>

			{isFilePicked ? (
				<div>
					<p>Filename: {selectedFile.name}</p>
					<p>Filetype: {selectedFile.type}</p>
				</div>
			) : (
				<p>Select a file to show details</p>
			)}
			<div>
				<button onClick={handleSubmission}>Submit</button>
			</div>
		</div>
	);
}
