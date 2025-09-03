/**
 * Factory middleware untuk validasi request dengan Joi
 * @param {Joi.Schema} schema
 * @param {"body"|"query"|"params"|"headers"} target
 */
export function validate(schema, target = "body") {
  return (req, res, next) => {
    const { value, error } = schema.validate(req[target], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    }); 

    if (error) {
      // bentuk error konsisten { code, message, data, metadata }
      const details = error.details?.map(d => d.message) || [error.message];
      
      console.log('Validation errors:', details);
      
      return res.status(400).json({
        code: 400,
        message: "Validations Error",
        data: { errors: details },
        metadata: null,
      });
    }

    // tulis balik hasil yang sudah “dibersihkan”
    req[target] = value;
    next();
  };
}
