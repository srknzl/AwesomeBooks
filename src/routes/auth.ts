import * as express from "express";
import { body } from "express-validator";

import * as authController from "../controllers/authController";

export const router = express.Router();

router.get('/newPassword/:token', authController.getNewPassword);

router.post("/logout", authController.postLogout);
router.post("/checklogin", authController.postCheckLogin);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage('Please enter a valid e-mail'),
    body("password").isLength({
      min: 8
    }).withMessage('Your password should be at least 8 characters')
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage('Please enter a valid e-mail'),
    body("name")
      .isString().withMessage('Your name should be text')
      .isLength({
        min: 3
      }).withMessage('Your name should have minimum of three characters'),
    body("password").isLength({
      min: 8
    }).withMessage('Your password must be at least 8 characters long'),
    body("confirmPassword").custom((value, { req }) => {
      if (req.body.password !== value) {
        throw new Error("Passwords did not match");
      }
      return true;
    })
  ],
  authController.postSignup
);

router.post(
  "/admin-login",
  [
    body("email").isEmail().withMessage('Please enter a valid e-mail'),
    body("password").isLength({
      min: 4
    }).withMessage('Your password should be at least 4 characters')
  ],
  authController.postAdminLogin
);
router.post("/reset",
  [
    body('email').isEmail().withMessage('Please enter a valid e-mail')
  ], authController.postReset);

router.post('/newPassword', [
  body("newPassword").isLength({
    min: 6
  }).withMessage('Your password must be at least 6 characters long'),
  body("confirmNewPassword").custom((value, { req }) => {
    if (req.body.newPassword !== value) {
      throw new Error("Passwords did not match");
    }
    return true;
  })
], authController.postNewPassword)


export default router;