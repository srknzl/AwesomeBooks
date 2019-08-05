import { RequestHandler } from "express";
import { hash, compare } from "bcrypt";
import { validationResult} from "express-validator";
import crypto from "crypto";

import User from "../models/user";
import Admin from "../models/admin";
import  { transport } from "../app";

export const getLogin: RequestHandler = (req, res, next) => {
  const successes = req.flash("success");
  const errors = req.flash("error");

  res.render("auth/login", {
    active: "login",
    pageTitle: "Login",
    successes: successes,
    errors: errors,
    validationMessages: [],
    autoFill: {}
  });
};

export const getSignup: RequestHandler = (req, res, next) => {
  const errors = req.flash("error");
  const successes = req.flash("success");

  res.render("auth/signup", {
    active: "signup",
    pageTitle: "Signup",
    errors: errors,
    successes: successes,
    validationMessages: [],
    autoFill: {}
  });
};
export const getAdminLogin: RequestHandler = (req, res, next) => {
  const errors = req.flash("error");
  const successes = req.flash("success");

  res.render("auth/admin-login", {
    active: "admin-login",
    pageTitle: "Admin login",
    errors: errors,
    successes: successes,
    validationMessages: [],
    autoFill: {}
  });
};
export const getReset: RequestHandler = (req, res, next) => {
  const successes = req.flash("success");
  const errors = req.flash("error");

  res.render("auth/reset", {
    active: "",
    pageTitle: "Reset your password",
    successes: successes,
    errors: errors,
    validationMessages: [],
    autoFill: {}
  });
};
export const postLogin: RequestHandler = async (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      active: "login",
      pageTitle: "Login",
      successes: [],
      errors: [],
      validationMessages: errors.array(),
      autoFill: {
        email: email,
        password: password
      }
    });
  }

  try {
    const user = await User.findOne({
      email: email
    });
    if (user) {
      const match = await compare(password, user.password);

      if (match && req.session) {
        req.session.user = user;
        req.session.userLoggedIn = true;
        return res.redirect("/user/welcome");
      } else {
        req.flash("error", "Email or password was wrong");
        const errors = req.flash("error");
        const successes = req.flash("success");

        return res.status(401).render("auth/login", {
          active: "login",
          pageTitle: "Login",
          successes: successes,
          errors: errors,
          validationMessages: [],
          autoFill: {
            email: email,
            password: password
          }
        });
      }
    } else {
      req.flash("error", "Email or password was wrong");
      const errors = req.flash("error");
      const successes = req.flash("success");

      return res.status(401).render("auth/login", {
        active: "login",
        pageTitle: "Login",
        successes: successes,
        errors: errors,
        validationMessages: [],
        autoFill: {
          email: email,
          password: password
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
  next();
};
export const postSignup: RequestHandler = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      active: "signup",
      pageTitle: "Signup",
      errors: [],
      successes: [],
      validationMessages: errors.array(),
      autoFill: {
        email: email,
        password: password,
        name: name,
        confirmPassword: confirmPassword
      }
    });
  }

  const foundUser = await User.findOne({
    email: email
  });

  if (foundUser) {
    req.flash("error", "Email is already in use!");
    const errors = req.flash('error');
    const successes = req.flash('success');

    return res.status(422).render("auth/signup", {
      active: "signup",
      pageTitle: "Signup",
      errors: errors,
      successes: successes,
      validationMessages: [],
      autoFill: {
        email: email,
        password: password,
        name: name,
        confirmPassword: confirmPassword
      }
    });
  }

  const hashPass = await hash(password, 12);

  const user = new User({
    password: hashPass,
    name: name,
    email: email,
    cart: {
      items: []
    }
  });

  await user.save();

  req.flash("success", "Successfully signed up!");
  res.redirect("/login");
};

export const postAdminLogin: RequestHandler = async (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/admin-login", {
      active: "admin-login",
      pageTitle: "Admin login",
      errors: [],
      successes: [],
      validationMessages: errors.array(),
      autoFill: {
        email: email,
        password: password
      }
    });
  }

  try {
    const admin = await Admin.findOne({
      email: email
    });
    if (admin) {
      const match = await compare(password, admin.password);

      if (match && req.session) {
        req.session.admin = admin;
        req.session.adminLoggedIn = true;
        return res.redirect("/admin/welcome");
      } else {
        req.flash("error", "Email or password was wrong");
        const errors = req.flash("error");
        const successes = req.flash("success");

        return res.status(401).render("auth/admin-login", {
          active: "admin-login",
          pageTitle: "Admin login",
          errors: errors,
          successes: successes,
          validationMessages: [],
          autoFill: {
            email: email,
            password: password
          }
        });
      }
    } else {
      req.flash("error", "Email or password was wrong");
      const errors = req.flash("error");
      const successes = req.flash("success");

      return res.status(401).render("auth/admin-login", {
        active: "admin-login",
        pageTitle: "Admin login",
        errors: errors,
        successes: successes,
        validationMessages: [],
        autoFill: {
          email: email,
          password: password
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
  next();
};
export const postLogout: RequestHandler = (req, res, next) => {
  if (!req.session) throw "No session";

  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect("/");
  });
};

export const postReset: RequestHandler = async (req, res, next) => {
  const email = req.body.email;
  const errors = validationResult(req);
  

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/reset", {
      active: "",
      pageTitle: "Reset your password",
      successes: [],
      errors: [],
      validationMessages: errors,
      autoFill: {
        email: email
      }
    });
  }
  const user = await User.findOne({
    email: email
  });
  if(!user){
    req.flash('error','This e-mail is not associated with an account!');
    const errors = req.flash('error');
    const successes = req.flash('success');

    return res.status(422).render("auth/reset", {
      active: "",
      pageTitle: "Reset your password",
      successes: successes,
      errors: errors,
      validationMessages: [],
      autoFill: {
        email: email
      }
    });
  }
  const bytes = crypto.randomBytes(32);
  
  const hex = bytes.toString('hex');

  user.resetToken = hex;
  user.resetTokenExpiry = new Date(Date.now() + 1000*60*60);

  await user.save();

  transport.sendMail({
    from: 'registration@awesomebookshop.com',
    to: email,
    subject: 'Password Reset',
    html: `
      <p> You requested a password reset, and here is your <a href="http://localhost:3000/newPassword/${hex}">link</a> that you can use for that.  </p>
      <p> Keep in mind that you have 1 hour until expiration of this url. </p>
      <p> Please do not share this link.</p>
    `
  });
  req.flash('success','Email sent!');
  res.redirect('/');
};