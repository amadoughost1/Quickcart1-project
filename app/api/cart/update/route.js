import connectDB from '@/config/db';
import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function POST(request) {
    try {

        const { userId } = getAuth(request)

        const { cartData } = await request.json()

        // Valider que tous les IDs de produits sont des ObjectIds MongoDB valides
        for (const productId in cartData) {
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return NextResponse.json({
                    success: false,
                    message: `Invalid product ID: ${productId}. Product ID must be a valid MongoDB ObjectId.`
                }, { status: 400 });
            }
        }

        await connectDB();
        const user = await User.findById(userId);

        user.cartItems = cartData
        await user.save()

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Cart update API error:', error);
        return NextResponse.json({ success: false, message: error.message || "Something went wrong" })
    }
}
