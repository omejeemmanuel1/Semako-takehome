import Joi from "joi";

export const createSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  pin: Joi.number().required(),
});
export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};
