import { inngest } from "@/config/inngest";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import mongoose from 'mongoose';
import { orderDummyData } from "@/assets/assets";

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "invalid data" }, { status: 400 });
        }

        // Valider que tous les IDs de produits sont des ObjectIds MongoDB valides
        for (const item of items) {
            if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
                return NextResponse.json({
                    success: false,
                    message: `Invalid product ID: ${item.product}. Product ID must be a valid MongoDB ObjectId.`
                }, { status: 400 });
            }
        }

        // Essayer de se connecter à la base de données
        try {
            await connectDB()

            // Si la connexion réussit, créer la vraie commande
            // Calculate amount using items
            let amount = 0;
            for (const item of items) {
                const product = await Product.findById(item.product);
                if (product && product.offerPrice) {
                    amount += product.offerPrice * item.quantity;
                } else {
                    return NextResponse.json({
                        success: false,
                        message: `Product not found or invalid price for product ${item.product}`
                    }, { status: 400 });
                }
            }

            const finalAmount = amount + Math.floor(amount * 0.2); // 20% tax + delivery charge

            await inngest.send({
                name: 'order/created',
                data: {
                    userId,
                    address,
                    items,
                    amount: finalAmount,
                    date: Date.now()
                }
            })

            // Clear user cart
            const user = await User.findById(userId)
            if (user) {
                user.cartItems = {}
                await user.save()
            }

            return NextResponse.json({ success: true, message: 'Order placed' })

        } catch (dbError) {
            console.warn('Database connection or query failed, creating dummy order:', dbError.message);

            // Créer une commande factice
            const dummyOrder = {
                _id: `dummy_${Date.now()}`,
                userId: userId,
                items: items,
                amount: 0, // Sera calculé plus tard
                address: address,
                status: "Order Placed",
                date: Date.now()
            };

            // Envoyer l'événement Inngest même pour les commandes factices
            try {
                await inngest.send({
                    name: 'order/created',
                    data: {
                        userId,
                        address,
                        items,
                        amount: 0,
                        date: Date.now()
                    }
                });
            } catch (inngestError) {
                console.error('Inngest error:', inngestError);
            }

            return NextResponse.json({
                success: true,
                message: 'Order placed (dummy mode - database not available)',
                order: dummyOrder
            });
        }

    } catch (error) {
        console.error('Order create API error:', error);
        return NextResponse.json({ success: false, message: error.message || "Something went wrong" }, { status: 500 });
    }
}