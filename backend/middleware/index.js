export const validation = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });

    if (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error,
            //errors: error.details.map((detail) => detail.message)
        });
    }

    return next();
};
