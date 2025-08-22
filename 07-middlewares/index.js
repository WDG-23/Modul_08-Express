import express from 'express';
import { userRouter, postRouter } from './routers/index.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8080;
// Globale Middlewares - alle Requests durchlaufen diese
app.use(express.json()); // req.body
app.use(cors());

// Selbstgebaute Middleware - Funktionssignatur ist vorgegeben
const dayGuardMiddleware = (req, res, next) => {
  console.log(req.headers);
  const date = new Date().getDay();
  console.log(date);
  if (date === 5) {
    // Wir können den Request-Response-Cycle direkt aus der Middleware beenden
    res.json({ msg: 'Not available on Fridays' });
    return;
  }

  // Wenn alles gut gegangen ist, leiden wir den Request an den nächsten Abschnitt weiter.
  next();
};
// Beispiel für Router-spezifische Middleware
// app.use('/users', dayGuardMiddleware, userRouter);

app.use('/users', userRouter);
app.use('/posts', postRouter);

// Der Error Handler ist eine spezielle Middleware, die immer als letztes Glied in unserer Pipeline stehen muss.
// Die Funktionssignatur muss (error, request, response, next) sein, auch wenn ihr nicht alle Parameter benutzt.
// Der Error Handler ist wie ein Catch-Block für die gesamte Express-App.
app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(err.cause || 500).json({ msg: err.message });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
