import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function SinglePagePdf(props) {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
    const [showPdf, setShowPdf] = useState(false);
	const { pdf } = props;

	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
		setPageNumber(1);
	}

    const setShowTable = (value) => {
        setShowPdf(value);
    }

    function changePage(offset) {
		setPageNumber((prevPageNumber) => prevPageNumber + offset);
	}

	function previousPage() {
		changePage(-1);
	}

	function nextPage() {
		changePage(1);
	}

    useEffect(() => {
    }, []);

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
                    <>
                        <Document
                            file={pdf}
                            options={{ workerSrc: '/pdf.worker.js' }}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            <Page pageNumber={pageNumber} />
                        </Document>
                        <div className="container-center">
                            <p>Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}</p>
                            <button className="class-button" type="button" disabled={pageNumber <= 1} onClick={previousPage}>
                                Previous
                            </button>
                            <button className="class-button" type="button" disabled={pageNumber >= numPages} onClick={nextPage}>
                                Next
                            </button>
                        </div>
                    </>
            }
		</>
	);
}
