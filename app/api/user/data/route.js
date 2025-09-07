import connectDB from "@/config/db"
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";
import { userDummyData } from "@/assets/assets";

export async function GET(request) {
    try {
        const { userId } = getAuth(request)

        // Essayer de se connecter à la base de données
        try {
            await connectDB()

            // Si la connexion réussit, essayer de récupérer les vraies données
            const user = await User.findById(userId)
            if (!user) {
                // Si l'utilisateur n'existe pas en base, créer un utilisateur factice
                const dummyUser = {
                    ...userDummyData,
                    _id: userId,
                    cartItems: userDummyData.cartItems || {}
                };
                return NextResponse.json({
                    success: true,
                    user: dummyUser,
                    message: 'User not found in database, using dummy data'
                });
            }
            return NextResponse.json({ success: true, user })

        } catch (dbError) {
            console.warn('Database connection or query failed, using dummy user data:', dbError.message);
            // En cas d'erreur de base de données, utiliser les données factices
            const dummyUser = {
                ...userDummyData,
                _id: userId,
                cartItems: userDummyData.cartItems || {}
            };
            return NextResponse.json({
                success: true,
                user: dummyUser,
                message: 'Database not available, using dummy data'
            });
        }

    } catch (error) {
        console.error('User data API error:', error);
        // En cas d'erreur générale, retourner les données factices
        const dummyUser = {
            ...userDummyData,
            _id: userId,
            cartItems: userDummyData.cartItems || {}
        };
        return NextResponse.json({
            success: true,
            user: dummyUser,
            message: 'Error occurred, using dummy data'
        })
    }
}