import express from 'express';
import csrf from 'csurf';

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// Middleware to generate CSRF token and send to frontend
router.get('/csrf-token', csrfProtection, (req, res) => {
    // attach the token to the request object
  res.json({ csrfToken: req.csrfToken() });
});

// when a GET request is made to the route, a CSRF token is generated and is sent back as json in the response

export default router;