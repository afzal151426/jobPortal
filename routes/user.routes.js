import express from "express"
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.route("/register").post(register)
router.route("/login").post(login);
router.route("/logout").post(logout);
// //authenticated user can only update their profile so for that we will make a middleware 
router.route("/profile/update").post(isAuthenticated,updateProfile);
export default router;
// module.exports = router;