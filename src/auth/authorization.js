import express from "express";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase.js";

const authRouter = express.Router();

/*
* sign up api
*/
authRouter.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const userCredential = await createUserWithEmailAndPassword(auth, username, password)
        const user = userCredential.user;
        res.status(201).json({ success: true, message: 'User created Succesfully!', uid: user.uid });

    } catch (e) {
        res.status(400).json({ message: e.code, errorMessage: e.message });
    }
});


/*
* Login api
*/
authRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const userCredential = await signInWithEmailAndPassword(auth, username, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        res.status(200).json({
            success: true,
            message: 'User logged in Successfully',
            uid: user.uid,
            token: token
        });

    } catch (e) {
        res.status(401).json({ message: e.code, errorMessage: e.message });
    }
});

/*
* signout api
*/
authRouter.post('/signout', async (req, res) => {
    try {
        await signOut(auth);
        res.status(200).json({ success: true, message: 'user Signed out!' });
    } catch (e) {
        res.status(500).json({ message: 'failed to signout', errorMessage: e.message });
    }
});

export default authRouter;