import connectDB from '@/config/db'
import authSeller from '@/lib/authSeller'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Product from '@/models/Product'

export async function GET(request) {
    try {
        const { userId } = getAuth(request)

        const isSeller = authSeller(userId)

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized" });
        }

        await connectDB()

        const products = await Product.find({ userId })

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