import { NextResponse } from "next/server";
import { SHA256 as sha256 } from "crypto-js";
import { SignJWT } from "jose";
import prisma from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_KEY as string);
const alg = "HS256";
const createToken = async (email: string, userId: number) => {
  return await new SignJWT({ email, userId, isAdmin: false })
    .setProtectedHeader({ alg })
    .setExpirationTime("48h")
    .sign(secret);
};

export async function POST(request: Request) {
  console.log("hello from backkef");

  const { email, password, firstName, lastName } = await request.json();
  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json(
      { message: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: sha256(password).toString(),
      },
    });
    const token = await createToken(user.email, user.id);
    cookies().set("access_token", token);

    return NextResponse.json(
      {
        access_token: token,
        userInfo: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
