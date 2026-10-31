import {z} from 'zod';


export const messageSchema = z.object({
    content:z.string().min(6,'Content must be at least 10 Characters').max(300,'Content must be not longer than 300 Chars')
})