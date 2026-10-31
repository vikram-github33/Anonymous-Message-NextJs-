import { Suspense } from "react";
import VerifyForm from "./VerifyForm";

export default function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <Suspense fallback={<p>Loading verification page...</p>}>
      <VerifyFormWrapper params={params} />
    </Suspense>
  );
}

async function VerifyFormWrapper({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const  {username}  = await params;


  return <VerifyForm username={username} />;
}