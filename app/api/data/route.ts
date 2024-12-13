import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const {userId} =await auth()
  const user = await currentUser();

  if (!userId) {
    return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
  }

  return NextResponse.json(
    {
      message: "Authenticated",
      data: { userId: userId, firstname: user?.firstName ,lastname: user?.lastName, email: user?.emailAddresses  },
    },
    { status: 200 }
  );
}
