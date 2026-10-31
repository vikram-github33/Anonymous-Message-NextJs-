
"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import axios from "axios";
// import { useParams } from "next/navigation";
// import React, { Suspense } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
const formValidation = z.object({
  message: z.string(),
});
interface Props {
  username: string;
}
const SendMessageForm = ({username}:Props) => {
  const {handleSubmit,control,formState:{errors},getValues} = useForm({
    resolver: zodResolver(formValidation),
    defaultValues: {
      message: "",
    },
  });
  // const {username} = await params;
console.log(username)
  const onSubmit = async(data:{message:string}) =>{
    try {
      const response = await axios.post('/api/send-messages',{
        message: getValues('message'),
        username
      });
      console.log(response)
    } catch (error) {
      
    }
  }
  return (
    
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      flexDirection="column"
      gap={2}
    >
     <Controller
        name="message"
        control={control}
        rules={{
          required: "Message is required",
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Enter a valid Message",
          },
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Message"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Button type="submit" variant="contained">
        Submit
      </Button>
    </Box>
  );
};

export default SendMessageForm;
