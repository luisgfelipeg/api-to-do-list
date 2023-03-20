import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import StatusCodes from 'http-status-codes';

/* REGISTER NEW USER */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: passwordHash,
    });

    const savedUser = await newUser.save();
    res.status(StatusCodes.CREATED).json(savedUser);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: err.message });
  }
};

/* LOGIN IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'User does not exist. ' });

    const isMatch = user.password
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!isMatch)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'Invalid credentials. ' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    user.password = undefined;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};
