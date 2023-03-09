import joi from "joi";

export const createPostSchema = joi.object ({
    link: joi.string().required().min(10),
    message: joi.string().empty(null)
});