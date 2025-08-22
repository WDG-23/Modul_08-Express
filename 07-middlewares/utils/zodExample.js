import { z } from 'zod/v4';

// Mit Zod (oder ähnlichen Bibliotheken) könnt ihr leicht überprüfen, of eine Variable den Inhalt hat, den ihr erwartet.
// Dafür legt ihr ein "Schema" an, die die erwarteten Daten beschreibt.
const mySchema = z.email();

const ObjectSchema = z.object({
  email: z.string().trim().email(),
  firstName: z.string().max(255),
  lastName: z.string().max(255),
  age: z.number().positive(),
});

// console.log(mySchema.safeParse('max@musterman.com'));

const myObj = {
  email: 'max@mustermann.com   ',
  firstName: 'max',
  lastName: 'mustermann',
  age: 3,
  invald: true,
};
// Mit 'schema.parse()' oder 'schema.safeParse()' könnt ihr eine Variable mit dem Schema vergleichen. Zod sammelt alle Abweichungen und hilft bei der Fehlerformatierung.
console.log(ObjectSchema.safeParse(myObj));
