import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import User from "@/app/models/User";

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const { name, email, password } = await req.json();

    // Validate the input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create a new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Return the user without the password
    const userWithoutPassword = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
