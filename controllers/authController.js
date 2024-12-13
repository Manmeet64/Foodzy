import userModel from "../models/userModel.js";

export async function Create(req, res) {
    let user = req.body;
    const firebaseId = req.firebaseId;
    const email = req.email;

    // Add firebaseId to the user object
    user.firebaseId = firebaseId;
    user.email = email;
    const existingUser = await userModel.findOne({ firebaseId });
    if (existingUser) {
        return res
            .status(400)
            .send({ message: "User with this Firebase ID already exists" });
    }
    try {
        await userModel.create(user);
        res.status(201).send({ message: "User Created Successfully" });
    } catch (err) {
        res.status(500).send({
            message: "Some Problem occurred while creating user",
        });
    }
}

export async function Find(req, res) {
    const firebaseId = req.firebaseId;
    try {
        let user = await userModel.findOne({ firebaseId });
        res.status(200).send({
            message: "User fetched successfully",
            data: user,
        });
    } catch (err) {
        res.status(500).send({ message: "User not found" });
    }
}
