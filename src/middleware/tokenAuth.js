import { admin } from '../auth/firebase.js';


/*
* middlewares - whenever user do any actions, use this as a middleware
*/
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // if no token, unauthorized

    // Verify the token using Firebase Admin SDK
    admin.auth().verifyIdToken(token)
        .then(decodedToken => {
            const uid = decodedToken.uid;
            // Attach UID to the request, so it can be used in your route handler
            req.uid = uid;
            console.log("User verified!");
            next();
        })
        .catch((error) => {
            // Handle error
            console.error('Error verifying auth token', error);
            res.status(403).json({ message: error.message + 'Token is not authorized!' }); // Forbidden
        });
};

export default verifyToken;