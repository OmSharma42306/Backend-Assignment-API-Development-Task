import z from "zod"

// Creating signUpInput object  using zod library
export const signUpInput = z.object({
    name : z.string(),
    email : z.string().email(),
    password : z.string().min(8)
});

// Creating loginInput object  using zod library
export const loginInput = z.object({
    email : z.string().email(),
    password : z.string().min(8)
})

