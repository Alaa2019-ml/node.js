import newDatabase from "./database.js";
import jwt from "jsonwebtoken";
import { SECRET } from "../assets/keys.js";
// import dotenv from "dotenv";
import { hash, compare } from "bcrypt";

// Change this boolean to true if you wish to keep your
// users between restart of your application
// const router = express.Router();
// dotenv.config();

const isPersistent = true;
const database = newDatabase({ isPersistent });

const SALT_ROUNDS = 12;
// const SECRET = process.env.SECRET;
const usersData = new Map();
// Create middlewares required for routes defined in app.js

const getCreds = (req) => ({
  username: req.body?.username,
  password: req.body?.password,
});

const requireCreds = (res, { username, password }) => {
  if (!username || !password) {
    res.status(400).send("Missing data");
    return false;
  }
  return true;
};

const bearerToken = (req) => {
  const auth = req.headers.authorization || "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : null;
};

//register a new user
export const register = async (req, res) => {
  const { username, password } = getCreds(req);

  if (!requireCreds(res, { username, password })) return;

  if (usersData.has(username)) {
    return res.status(400).send("Username already exists. ");
  }

  try {
    const hashedPassword = await hash(password, SALT_ROUNDS);
    const newUser = { username, password: hashedPassword };
    const storedUser = database.create(newUser);
    usersData.set(username, storedUser.id);

    res.status(201).json({ username: storedUser.username });
  } catch (error) {
    return res.status(400).send("Error");
  }
};

//login
export const login = async (req, res) => {
  const { username, password } = getCreds(req);

  if (!requireCreds(res, { username, password })) return;

  const loggedUserId = usersData.get(username);
  if (!loggedUserId) {
    return res.status(404).send("Incorrect username ");
  }

  const user = database.getById(loggedUserId);

  if (!user) {
    // User was not found in the database
    return res.status(404).send("User not found ");
  }
  try {
    // compare the password to the user's hashed password
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).send("Incorrect password");

    //create JWT
    const token = jwt.sign({ id: user.id }, SECRET);
    // console.log(token);
    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).send("Error");
  }
};

//get profile
export const profile = (req, res) => {
  //decode the token
  const token = bearerToken(req);

  if (!token) {
    return res.status(401).json("No token");
  }

  try {
    const decodedUser = jwt.verify(token, SECRET);
    const user = database.getById(decodedUser.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json({ username: user.username });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const logout = (req, res) => {
  return res.sendStatus(204);
};
// You can also create helper functions in this file to help you implement logic
// inside middlewares
