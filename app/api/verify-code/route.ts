import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, code } = await request.json();
  const user = await UserModel.findOne({
    username,
  });
  if (!user) {
    return Response.json(
      {
        success: false,
        message: "Username not exists",
      },
      { status: 400 },
    );
  }
  console.log("user",user)
  console.log("code",code)

  const varifyCode = user.verifyCode == code;
  console.log("varifyCode",varifyCode)
  const isCodeExpiry = new Date(user.verifyCodeExpiry) > new Date();
  if (varifyCode && isCodeExpiry) {
    user.isVerified = true;
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Account verified successfully",
      },
      { status: 201 },
    );
  }
}
