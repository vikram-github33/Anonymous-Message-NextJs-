import dbConnect from "@/app/lib/dbConnect";
import UserModel, { Message } from "@/app/model/User";
// import { log } from "console";

export async function POST(request: Request) {
  dbConnect();
  const { username, content } = await request.json();
  try {
    console.log("username ===",username)
    const users = await UserModel.find().exec();
    const user = await UserModel.findOne({ username }).exec();
    console.log("user=======",user)
    if (!user) {
      return Response.json(
        { message: "User Not Found", success: false },
        {
          status: 404,
        },
      );
    }
    if (!user.isAcceptingMessage) {
      return Response.json(
        { message: "User Not Accepting Message", success: false },
        {
          status: 404,
        },
      );
    }
    const newMessage = {content , createdAt:new Date()};
console.log("newMessage",newMessage)
    user.messages.push(newMessage as Message)
    await user.save()
     return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );
  } catch (error) {
    console.log(error)
     return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
