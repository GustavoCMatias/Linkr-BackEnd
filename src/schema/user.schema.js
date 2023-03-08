import joi from "joi";

export const register = joi.object({
    email: joi.string().empty().email().min(8).required(),
    password: joi.string().empty().min(6).required(),
    username: joi.string().empty().min(3).required(),
    picture_url: joi.string().empty().min(10).required(),
  });
  
  export const signIn = joi.object({
    email: joi.string().email().empty().required(),
    password: joi.string().empty().required(),
  });
  
