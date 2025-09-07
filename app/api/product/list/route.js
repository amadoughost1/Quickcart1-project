import connectDB from '@/config/db'
import { NextResponse } from 'next/server'
import Product from '@/models/Product'

export async function GET(request) {
    try {
        await connectDB()

        const products = await Product.find({})

        // Filtrer et valider les produits
        const validProducts = products.filter(product =>
            product &&
            product._id &&
            product.image &&
            Array.isArray(product.image) &&
            product.image.length > 0
        )

        return NextResponse.json({ success: true, products: validProducts })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}