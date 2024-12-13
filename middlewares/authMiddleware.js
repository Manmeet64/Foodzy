//Firebase authentication middleware
import firebaseAdmin from "../firebase.js";
export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .send({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log(token);
    try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        console.log("Decoded", decodedToken);
        req.firebaseId = decodedToken.uid; // Attach Firebase ID to the request
        req.email = decodedToken.email;
        next();
    } catch (error) {
        return res
            .status(401)
            .send({ message: "Unauthorized: Invalid token", error });
    }
}
