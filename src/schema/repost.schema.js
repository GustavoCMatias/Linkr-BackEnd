import joi from "joi";

export const postRepostSchema = joi.object ({
    post_id: joi.number().integer().required()
});