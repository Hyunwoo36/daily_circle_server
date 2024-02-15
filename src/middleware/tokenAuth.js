import { admin } from './firebaseAdmin.js'; // Make sure to initialize Firebase Admin SDK

// Middleware to authenticate and authorize users
const authenticate = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req.user = decodedToken; // Attach user information to the request
            next(); // Proceed to the next middleware or request handler
        } catch (error) {
            res.status(403).json({ error: 'Unauthorized access, invalid token' });
        }
    } else {
        res.status(403).json({ error: 'Unauthorized access, no token provided' });
    }
};

// Usage in an Express route
app.get('/some-protected-route', authenticate, (req, res) => {
    // Your route logic here, with access to req.user
    res.send('Access granted to protected content');
});
