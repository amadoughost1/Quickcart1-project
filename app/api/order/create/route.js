import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(request) {
    try {

        const { userId } = getAuth(request)
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "invalid data" }, { status: 400 });
        }

        //calculate amount using items
        const amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return acc + product.offerPrice * item.quantity;
        },0)

        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                items,
                amount: amount + Math.floor(amount * 0.2), //10% tax + 50 delivery charge
                address,
                date: Date.now()
            }
        })
        //clear user cart
        const user = await User.findById(userId)
        user.cartItems = []
        user.save()

        return NextResponse.json({ success: true, message: 'Order placed' })


    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message || "Something went wrong" }, { status: 500 });

    }
}