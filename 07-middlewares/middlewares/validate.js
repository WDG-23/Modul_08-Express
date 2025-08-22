import { z } from 'zod/v4';

// Funktion höherer Ornung, die ein Validationsschema entgegennimmt
// und die eigentliche Middleware zurückgibt
const validate = (schema) => (req, res, next) => {
  // Überprüft, ob req.body unserem Schema entspricht
  const { success, data, error } = schema.safeParse(req.body);

  if (!success) {
    const message = z.prettifyError(error); // Formatierung der gesammelten Validationsfehler
    next(new Error(message, { cause: 400 })); // Gibt Error direkt an Error Handler Middleware
    return;
  }
  // Überschreibt req.body mit unseren überprüften und gesäuberten Daten
  req.body = data;
  // Setzt die Pipeline fort, wenn alles gut gegangen ist
  next();
};

export default validate;
