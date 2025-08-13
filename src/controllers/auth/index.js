import { AuthServices } from "../../services/index.js";

export const getSignup = (req, res, next) => {};

export const postSignup = async (req, res, next) => {
  try {
    const { body } = req;

    const response = await AuthServices.postSignupService(body);

    res.send({
      statusCode: response?.statusCode,
      data: response?.message,
    });
  } catch (error) {
    res.send({
      statusCode: 500,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { query } = req;

    const response = await AuthServices.verifyEmailService(query);

    return res.send({
      statusCode: 200,
      message: response.message,
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      message: error.message,
    });
  }
};

export const login = async (req, res, next) => {
  console.log(req);
  try {
    const { body } = req;
    const response = await AuthServices.loginService(body);

    const cookieOptionsForAccessToken = {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    };
    const cookieOptionsForRefreshToken = {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    };
    response.statusCode === 200
      ? (res.cookie("token", response.accessToken, cookieOptionsForAccessToken),
        res.cookie(
          "refreshToken",
          response.refreshToken,
          cookieOptionsForRefreshToken
        ))
      : res.send({
          statusCode: response.statusCode,
          message: response.message,
        });

    response.statusCode === 200
      ? res.send({
          statusCode: 200,
          message: "login successful",
          token: response.token,
        })
      : res.send({
          statusCode: response.statusCode,
          message: response.message,
        });
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      res.status(401).json({
        status: false,
        message: "Authorization error",
      });
    }

    const response = await AuthServices.getProfileService(user);
    console.log("=====================");

    if (!response) {
      return res.send({
        statusCode: 401,
        message: "authorization error",
      });
    }
    return res.send({
      statusCode: 200,
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error auth controller",
    });
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies?.refreshToken;
    console.log(
      refreshToken ? "refresh token found" : "refresh token not found"
    );
    // check from db also
    const response = await AuthServices.refreshTokenService(refreshToken);
  } catch (error) {}
};

export const logoutUser = async (req, res, next) => {
  try {
    res.cookie("token", "");
    //res.cookie("token","",{expires:new Date(0)})
    res.status(200).json({ success: true, message: "logged out successfully" });
  } catch (error) {
    console.log("error from logout controller", error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { body } = req;

    const response = await AuthServices.forgotPasswordService(body);
    // check response
    return response.statusCode === 200
      ? res.status(200).json({ message: "mail sent successfully" })
      : res.status(400).json({ success: false, message: "" });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const token = req.query?.token;
    const password = req.body?.password;
    const confirmPassword = req.body?.confirmPassword;

    if (password !== confirmPassword) {
      res.status(400).json({ success: true, message: "invalid entry" });
    }
    const response = await AuthServices.resetPasswordService(token, password);
    response.statusCode === 200
      ? res.status(200).json({ success: true, message: response.message })
      : res
          .status(400)
          .json({ success: false, message: "password reset failed" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
