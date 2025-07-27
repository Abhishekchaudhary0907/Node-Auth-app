import crypto from "crypto";
import { User } from "../../db/model/user/index.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../../utils/logger/index.js";
dotenv.config({});

export const getLoginService = (body) => {
  const { username, password } = body;

  return { status: true };
};

export const postLoginService = async (body) => {
  try {
    const { username, password } = body;
    const userDetails = db.find();
    if (!userDetails) {
      return {
        status: false,
        message: "username does not exist",
      };
    }

    const userPassword = userDetails.password;

    if (!username || !password) {
      return {
        status: false,
        message: "invalid credentials",
      };
    }
  } catch (error) {
    logger.error(error);
    throw new Error("login failed");
  }
};

export const postSignupService = async (body) => {
  try {
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return { statusCode: 400 };
    }

    const userAlreadyExist = await User.findOne({ email });

    if (userAlreadyExist) {
      return {
        statusCode: 400,
        message: "User already exist",
      };
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      console.log(token);
      user.verificationToken = token;
      user.verificationTokenExpires = Date.now() + 1000 * 60 * 10;
      await user.save();
      console.log("token stored in db");
      const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });
      logger.info("transporter created");

      transporter.verify((error, success) => {
        if (error) {
          console.error("Transporter error:", error);
        } else {
          logger.info("Server is ready to send messages");
        }
      });
      logger.info(process.env.BASE_URL);

      await transporter.sendMail({
        from: '"abhishek" <cabhishek691@gmail.com>',
        to: "abhishek.achy@gmail.com",
        subject: "Verify your email",
        text: `Please click on following link:
              ${process.env.BASE_URL}/api/v1/auth/verify?token=${token}`, // plain‑text body
        html: `Please click on following link:
              ${process.env.BASE_URL}/api/v1/auth/verify?token=${token}`, // HTML body
      });

      logger.info("mail sent");

      return {
        statusCode: 200,
        message: "User registration successfull",
      };
      //verify
    }
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};

export const verifyEmailService = async (query) => {
  try {
    const token = query.token;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return {
        statusCode: 400,
        message: "user is not verified",
      };
    }

    if (user.verificationTokenExpires < Date.now()) {
      user.verificationTokenExpires = undefined;
      user.verificationToken = undefined;
      // show resnd verify link
      await user.save();
      return {
        statusCode: 400,
        message: "token expired",
      };
    }

    user.isVerified = true;
    user.verificationTokenExpires = undefined;
    user.verificationToken = undefined;
    await user.save();
    return {
      statusCode: 200,
      message: "Email verified",
    };
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};

export const loginService = async (body) => {
  try {
    const { email, password } = body;

    if (!email || !password) {
      return { statusCode: 400, message: "invalid email or password" };
    }

    const user = await User.findOne({ email });
    if (!user) {
      return { statusCode: 400, message: "user not found" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);

    if (!isMatch) {
      return { statusCode: 400, message: "invalid email or password" };
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return { statusCode: 200, token: token };
    //const cookieOptions = {
    //httpOnly: true //now cookie is in control of backend ,cannot be accessed via JavaScript on the client side (e.g., via document.cookie)
    //secure:true,
    //maxAge:24*60*60*1000
    //}
    //res.cookie('test',token,cookieOptions)
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};

export const getProfileService = async (user) => {
  try {
    console.log("user id is :", user.id);
    const userP = await User.findById(user.id).select("-password"); //exclude password field
    if (!userP) {
      return { statusCode: 400, message: "Enter all field" };
    }
    console.log("user found in profile service");
    return { statusCode: 200, data: userP.email };
  } catch (error) {
    console.log("error in auth service");
    throw new Error(error);
  }
};

export const forgotPasswordService = async (body) => {
  try {
    const { email } = body;
    console.log(email);

    const user = await User.findOne({ email });
    //console.log(user);
    if (!user) {
      return { statusCode: 400, success: false, message: "email not found" };
    }
    const token = crypto.randomBytes(32).toString("hex");

    console.log("forgot password token", token);

    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = Date.now() + 1000 * 60 * 10;

    await user.save();
    console.log("data saved in db");
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
    console.log("transporter created");
    transporter.verify((error, success) => {
      if (error) {
        console.log("transporter error", error);
      } else {
        console.log("transporter is ready to send mail");
      }
    });

    await transporter.sendMail({
      from: '"abhishek" <cabhishek691@gmail.com>',
      to: "abhishek.achy@gmail.com",
      subject: "Verify your email",
      text: `Please click on following link:
              ${process.env.BASE_URL}/api/v1/auth/reset-password?token=${token}`, // plain‑text body
      html: `Please click on following link:
              ${process.env.BASE_URL}/api/v1/auth/reset-password?token=${token}`, // HTML body
    });

    return { statusCode: 200, message: "token send to mail" };

    // generate token and send it to user and store it in db as well
  } catch (error) {
    console.log("error in forgot-password token send service");
    throw new Error(error);
  }
};

export const resetPasswordService = async (token, password) => {
  try {
    console.log("token ", token);
    console.log("password", password);

    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) {
      return { statusCode: 400, message: "user not verified" };
    }

    if (user.resetPasswordTokenExpires < Date.now()) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpires = undefined;
      await user.save();
      return { statusCode: 400, message: "user not verified" };
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();
    return { statusCode: 200, message: "password reset successful" };
  } catch (error) {
    console.log("errror from reset password", error);
    throw new Error(error);
  }
};
