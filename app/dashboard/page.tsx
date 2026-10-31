"use client";
import React, { useEffect, useState } from "react";
import MessageCarosuel from "./MessageCarosuel";
// import messages from "@/app/messages.json";
import { useSession } from "next-auth/react";
// import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";

const page = () => {
  const { data: session } = useSession();
  console.log("session========", session);
  // const router = useRouter();
  // const handleRoute = () => {
  //   router.push(`/send-message/${session?.user.username}`);
  // };
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const getAnonymmousMsg = async () => {
      try {
        const res = await axios.get("/api/get-messages");
        console.log("res",res)
        if (res?.status) {
          setMessages(res?.data?.messages);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    getAnonymmousMsg()
  }, []);
  return (
    <div>
      {/* dashboard */}
      <MessageCarosuel messages={messages} />
      {/* <Button variant="contained" onClick={handleRoute}>
        Send Message
      </Button> */}
    </div>
  );
};

export default page;
