import { NextResponse } from "next/server";
import {Stripe} from 'stripe'

const stripe = new Stripe(process.env.STRIPE_KEY || "")

export async function POST(request:Request){
    try{
        const {bookingId,bookingType,userId,taxes,date} = await request.json()
        let bookingDetails
        switch(bookingType){
            case "trips":
                console.log("hello haha");
                
                bookingDetails=await prisma.trips.findUnique({
                    where:{id:bookingId}
                })
        }
        if(bookingDetails){
            const paymentIntent = await stripe.paymentIntents.create({
                amount:bookingDetails.price + taxes,
                currency:"inr",
                automatic_payment_methods:{
                    enabled:true
                }
            })
            await prisma.bookings.create({data:{
                bookingType,
                bookingTypeId:bookingId.toString(),
                user:{connect:{id:userId}},
                paymentIntent:paymentIntent.id,
                totalAmount:paymentIntent.amount,
                date
            }})
            // stripe creates payment intent whose id is stored in db and client_secret is passed to frontend.
            //This client secret would be used to connect to stripe
            return NextResponse.json({
                client_secret:paymentIntent.client_secret,

            })
        }
    }catch(error){
        return NextResponse.json(
            {message:"An unexpected error occured"},
            {status:500}
        )
    }
}

export async function PATCH(request:Request){
    try{
        const {paymentIntent} = await request.json()
        if(paymentIntent){
            await prisma.bookings.update({
                where:{paymentIntent},
                data:{isCompleted:true}
            })
        }
        return NextResponse.json({message:"Payment Successful"},{status:200})
        
    }catch(error){
        return NextResponse.json(
            {message:"An unexpected error occured"},
            {status:500}
        )
    }
}