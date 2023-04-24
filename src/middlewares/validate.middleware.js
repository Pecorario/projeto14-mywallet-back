export function validateSchema(schema) {
  return (req, res, next) => {
    console.log(req.body);
    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      const errors = validation.error.details.map(detail => detail.message);
      return res.status(422).send(errors);
    }

    next();
  };
}

export function validateTransaction(transaction) {
  return (req, res, next) => {
    const { value, description } = req.body;
    const { type } = req.params;

    const validation = transaction.validate(
      { value, description, type },
      { convert: false, abortEarly: false }
    );

    if (validation.error) {
      const errors = validation.error.details.map(detail => detail.message);
      return res.status(422).send(errors);
    }

    next();
  };
}
