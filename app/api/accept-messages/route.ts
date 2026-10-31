import dbConnect from "@/app/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/app/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }
  const user = session?.user;
  const userId = user._id;

  const { isAcceptingMessage } = await request.json();
  try {
    console.log("isAcceptingMessage",isAcceptingMessage)
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: isAcceptingMessage },
      { new: true },
    );
     if (!updatedUser) {
      // User not found
      return Response.json(
        {
          success: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      );
    }
     // Successfully updated message acceptance status
    return Response.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
     console.error('Error updating message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    );
  }
  }

