import connectDB from "@/config/db";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { orderDummyData } from "@/assets/assets";

export async function GET(request) {
    try {
        const { userId } = getAuth(request)

        // Essayer de se connecter à la base de données
        try {
            await connectDB()

            // Si la connexion réussit, essayer de récupérer les vraies données
            const orders = await Order.find({ userId }).populate('address items.product')
            return NextResponse.json({ success: true, orders })

        } catch (dbError) {
            console.warn('Database connection or query failed, using dummy data:', dbError.message);
            // En cas d'erreur de base de données, utiliser les données factices
            const userOrders = orderDummyData.filter(order =>
                order.userId === userId
            );
            return NextResponse.json({
                success: true,
                orders: userOrders,
                message: 'Database not available, using dummy data'
            });
        }

    } catch (error) {
        console.error('Order list API error:', error);
        // En cas d'erreur générale, retourner les données factices
        const userOrders = orderDummyData.filter(order =>
            order.userId === userId
        );
        return NextResponse.json({
            success: true,
            orders: userOrders,
            message: 'Error occurred, using dummy data'
        })
    }
}