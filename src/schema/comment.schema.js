import joi from "joi";

export const CommentSchema = joi.object ({
    content: joi.string().required().min(1),
    post_id: joi.number().min(0).required()
});