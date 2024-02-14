import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { useState } from 'react'
const GenerateMockProductData = () => {
	const [loading, setLoading] = useState(false)
	const handleMockData = async () => {
		setLoading(true)
		// Generate random mock data for categories, subcategories, and products
		// Generate random mock data for categories, subcategories, and products
		const categories = generateCategories(5) // Adjust the number of categories

		// Add category documents with nested subcategories
		for (const category of categories) {
			const categoryId = category.id
			const categoryRef = doc(db, 'categories', categoryId)
			await setDoc(categoryRef, category)

			const subcategories = generateSubcategories(categoryId, 3)
			for (const subcategory of subcategories) {
				// const subcategoryRef = await addDoc(collection(categoryRef, 'subcategories'), subcategory);
				// const subcategoryId = subcategoryRef.id;
				const subcategoryRef = doc(
					categoryRef,
					'subcategories',
					subcategory.id
				)
				await setDoc(subcategoryRef, subcategory)
				const subcategoryId = subcategory.id
				const products = generateProducts(categoryId, subcategory.id, 4)
				for (const product of products) {
					const productId = product.id
					const productData = {
						...product,
						categoryId,
						subcategoryId,
					}

					// Add product documents with references to subcategories
					await setDoc(doc(db, 'products', productId), productData)
				}
			}
		}
		setLoading(false)
	}
	function generateCategories(count: number) {
		const categories = []
		for (let i = 0; i < count; i++) {
			const categoryId = `category-${i + 1}`
			categories.push({
				id: categoryId,
				name: `Category ${i + 1}`,
				description: `Description for category ${i + 1}`,
				imageUrl: `https://placeimg.com/640/480/category${i + 1}`,
			})
		}
		return categories
	}
	function generateSubcategories(categoryId: string, count: number) {
		const subcategories = []
		for (let i = 0; i < count; i++) {
			subcategories.push({
				id: `subcategory-${categoryId}-${i + 1}`,
				name: `Subcategory ${i + 1} of ${categoryId}`,
				description: `Description for subcategory ${
					i + 1
				} of ${categoryId}`,
			})
		}
		return subcategories
	}

	function generateProducts(
		categoryId: string,
		subcategoryId: string,
		count: number
	) {
		const products = []
		for (let i = 0; i < count; i++) {
			const productId = `product-${categoryId}-${subcategoryId}-${i + 1}`
			products.push({
				id: productId,
				name: `Product ${i + 1} in ${subcategoryId}`,
				description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
				images: [
					'https://placeimg.com/640/480/product',
					'https://placeimg.com/640/480/product2',
				], // Add more image URLs if needed
				variations: generateVariations(
					productId,
					Math.floor(Math.random() * 4) + 1
				), // Randomly generate 1-4 variations
			})
		}
		return products
	}

	function generateVariations(productId: string, count: number) {
		const variations = []
		const sizeOptions = ['S', 'M', 'L', 'XL']
		const colorOptions = ['Red', 'Blue', 'Green']

		for (let i = 0; i < count; i++) {
			const size =
				sizeOptions[Math.floor(Math.random() * sizeOptions.length)]
			const color =
				colorOptions[Math.floor(Math.random() * colorOptions.length)]
			variations.push({
				id: `variation-${productId}-${i + 1}`,
				size,
				color,
				skuId: `SKU-${productId}-${size}-${color}`,
				mrp: Math.floor(Math.random() * 100) + 50,
				quantity: Math.floor(Math.random() * 10) + 1,
			})
		}
		return variations
	}
	return (
		<>
			<button
				onClick={handleMockData}
				disabled={loading}
				className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
				{loading ? 'Generating...' : 'Generate Mock Product Data'}
			</button>
		</>
	)
}

export default GenerateMockProductData
