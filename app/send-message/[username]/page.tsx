import SendMessageForm from "./SendMessageForm";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return <SendMessageForm username={username} />;
}