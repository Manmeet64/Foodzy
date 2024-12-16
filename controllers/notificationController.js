import firebaseAdmin from "../firebase.js";
export default async function sendNotification(req, res) {
    const { token, title, body } = req.body;

    console.log("Request Body:", req.body);

    try {
        const message = {
            notification: { title, body },
            token,
        };
        console.log("Sending message:", message);
        const response = await firebaseAdmin.messaging().send(message);
        console.log("Message sent successfully:", response);
        res.status(200).send({ success: true, response });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).send({ success: false, error: error.message });
    }
}
