import React, { useEffect, useState, useRef } from 'react'
import { db } from '../../services/firebase'
import { writeBatch, doc, setDoc, collection } from 'firebase/firestore'
// import QRious from 'qrious'
import jsPDF from 'jspdf'
import { addMonths } from 'date-fns'
const GenerateQRAndPdf: React.FC = () => {
	const [processStarted, setProcessStarted] = useState(false)
	const abortController = useRef(new AbortController())

	useEffect(() => {
		return () => {
			abortController.current.abort() // Abort ongoing requests on unmount
		}
	}, [])
	const createQrCode = (data: any, size: string) => {
		try {
			const encodedData = encodeURIComponent(JSON.stringify(data))
			const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedData}&size=${size}`
			return url
		} catch (error: any) {
			console.error('Error creating QR code:', error.message)
			return null
		}
	}

	const writeBatchToFirestore = async (batchId: string, qrIds: string[]) => {
		try {
			const batch = writeBatch(db)

			// Calculate expiry date (1 month from now)
			const expiryDate = addMonths(new Date(), 1)

			// Write to Firestore collection (qrcodes)
			const qrCollectionRef = doc(db, 'qrcodes', batchId)
			await setDoc(qrCollectionRef, { batchId, expiryDate })

			// Write to subcollection (qrids)
			const subcollectionRef = collection(qrCollectionRef, 'qrids')
			qrIds.forEach(async (qrId) => {
				const qrDocRef = doc(subcollectionRef, qrId)
				await setDoc(qrDocRef, { qrid: qrId, iScanned: false })
			})

			// Commit the batch
			await batch.commit()
			console.log('Firestore write successful')
			return true
		} catch (error: any) {
			console.error('Error writing to Firestore:', error.message)
			return false
		}
	}

	const renderPdf = async (qrCodes: string[]) => {
		// Create a new jsPDF instance
		const pdf = new jsPDF({
			orientation: 'landscape',
			unit: 'in',
			format: [2, 2],
		})

		// Loop through QR codes and add them to the PDF
		for (let index = 0; index < qrCodes.length; index++) {
			if (index !== 0) {
				pdf.addPage() // Add a new page for each QR code (except the first one)
			}

			// Calculate dimensions to fit image on the page with a gap of 0.1 inch on each side
			const maxWidth = 2 - 0.2 // Width of the page minus gap
			const maxHeight = 2 - 0.4 // Height of the page minus gap (leaving space on top for text)
			const aspectRatio = 300 / 300 // Aspect ratio of the image

			let width = maxWidth
			let height = maxWidth / aspectRatio

			if (height > maxHeight) {
				height = maxHeight
				width = maxHeight * aspectRatio
			}

			// Center the image on the page with a gap
			const x = (2 - width) / 2
			const y = 0.2 // Starting from 0.2 inch down to leave space for text

			// Add the name on top of each page
			const name = `Page ${index + 1}`

			// Calculate the font size to fit within the space
			const fontSize = 10
			pdf.setFontSize(fontSize)
			const textWidth =
				(pdf.getStringUnitWidth(name) * fontSize) /
				pdf.internal.scaleFactor
			const textX = x + (width - textWidth) / 2
			const textY = y - 0.05 // Adjust the vertical position as needed

			// Add the text to the PDF
			pdf.text(name, textX, textY)

			// Add the QR code as an image to the PDF
			pdf.addImage(qrCodes[index], 'PNG', x, y, width, height)
		}

		// Save the PDF and trigger download
		pdf.save('QRCodes.pdf')
	}

	const generateQRAndPdf = async (
		batchId: string,
		qrCount: number,
		size: string
	) => {
		const qrIds = Array.from({ length: qrCount }, (_, i) => `qrid${i + 1}`)
		const qrCodes: string[] = []

		for (const qrId of qrIds) {
			const url = createQrCode({ batchId, qrId }, size)

			if (url) {
				qrCodes.push(url)
			} else {
				console.error(`Failed to generate QR code for ${qrId}`)
				return
			}
		}

		const writeSuccess = await writeBatchToFirestore(batchId, qrIds)

		if (writeSuccess) {
			// Write successful, render PDF
			renderPdf(qrCodes)
		} else {
			console.error('Firestore write failed, rolling back...')
			// Implement rollback logic if needed
		}
	}
	const handleButtonClick = async () => {
		// Example usage
		setProcessStarted(true)
		const batchId = '030282'
		const qrCount = 10
		const size = '300x300'
		await generateQRAndPdf(batchId, qrCount, size)
		setProcessStarted(false)
	}

	return (
		<button
			onClick={handleButtonClick}
			disabled={processStarted}
			className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
			{processStarted ? 'Processing...' : 'Start Process'}
		</button>
	)
}
export default GenerateQRAndPdf
