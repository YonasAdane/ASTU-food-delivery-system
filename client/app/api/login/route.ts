import { getErrorMessage } from "@/lib/get-error-message";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("login route");
	const cookieStore =await cookies();
  try {
    const { email, password } = await req.json();
    console.log({email, password});
    const response = await fetch(`${process.env.API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ message: errorText }, { status: response.status });
    }

    const { token:access_token } = await response.json();
    console.log({access_token});
    const userRes = await fetch(`${process.env.API_URL}/users/info`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });

    const userData = await userRes.json() as {message:string,data:User};
    console.log(userData)
    // Store JWT token securely in HttpOnly cookie
    cookieStore.set("token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
   
    cookieStore.set("user", JSON.stringify({
      id: userData.data._id,
      email: userData.data.email,
      role: userData.data.role,
    }), {
      httpOnly: false,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: userData.data,
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: getErrorMessage(err) ?? "Login failed" },
      { status: 500 }
    );
  }
}
