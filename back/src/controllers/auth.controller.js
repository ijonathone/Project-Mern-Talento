import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import {createAccessToken} from '../libs/jwt.js'

export const register = async (req, res) => {
  const { userName, email, password } = req.body;

  try {

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = new User({
      userName,
      email,
      password: passwordHash,
    });

     const userSaved = await newUser.save();
     const token = await createAccessToken({ id: userSaved._id })
      res.cookie('token', token)
      res.json({
        message: "User created successfully"
      })   
     res.json({
      id: userSaved._id,
      userName: userSaved.userName,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
     })
  } catch (error) {
    res.status(500).json({message: error.message})
  }

 
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json({
        message: ["The email does not exist"],
      });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        message: ["The password is incorrect"],
      });
    }

    const token = await createAccessToken({
      id: userFound._id,
      userName: userFound.userName,
    });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userFound._id,
      username: userFound.userName,
      email: userFound.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

