import prisma from '../../../../lib/prisma'
import { NextResponse } from 'next/server'
import { jobsQueue } from '../../../../lib/queue'

export async function POST(req:Request) {
    try{
        const {url,jobType}=await req.json()
        const res=await prisma.jobs.create({data:{url,jobType}})

        await jobsQueue.add("new location",{url,jobType,id:res.id})

        return NextResponse.json({jobCreated:true},{status:201})

    }catch(error){
        return NextResponse.json({ message: "An unexpected error occured" }, { status: 500 }); 
    }
}