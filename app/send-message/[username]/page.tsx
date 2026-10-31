
import { Suspense } from "react";
import SendMessageForm from "./SendMessageForm";

export default function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading message page...</div>}>
      <SendMessageContent params={params} />
    </Suspense>
  );
}

async function SendMessageContent({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return <SendMessageForm username={username} />;
}
