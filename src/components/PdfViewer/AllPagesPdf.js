import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function AllPagesPdf(props) {
	const [numPages, setNumPages] = useState(null);
    const [showPdf, setShowPdf] = useState(false);
	const { pdf } = props;

    useEffect(() => {
    }, []);

    function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
	}

    const setShowTable = (value) => {
        setShowPdf(value);
    }

	return (
        <>
            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                setShowTable(true);
            }}>Show Pdf</Button>
            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                setShowTable(false);
            }}>Hide Pdf</Button>
            <br /><br />

            {
                showPdf === true &&
                    <Document
                        file={pdf}
                        options={{ workerSrc: '/pdf.worker.js' }}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                        ))}
                    </Document>
            }
        </>
	);
}
