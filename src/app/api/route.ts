import { cookies } from "next/headers";

export async function POST(request: Request) {
    const { token } = await request.json();

    const cookieStore = await cookies();
    cookieStore.set("authToken", token, {
        httpOnly: true,
        path: "/",
        maxAge: 604800,
        secure: true,
        sameSite: "strict",
    });

    return new Response(JSON.stringify({ message: "Token saved to cookie" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken");

    return new Response(JSON.stringify({ token: token?.value || null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function DELETE(request: Request) {
    const cookieStore = await cookies();

    cookieStore.set("authToken", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        secure: true,
        sameSite: "strict",
    });

    return new Response(
        JSON.stringify({ message: "Token removed from cookie" }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    );
}
