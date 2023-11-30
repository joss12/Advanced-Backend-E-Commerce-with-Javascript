import { User } from "../models/User.js";
import { sendEmail } from "../utils/email.js";
import ErrorCatch from "../utils/error.js";
import { sendToken, cookieOptions, getDataUri } from "../utils/token.js";
// import { sendToken, cookieOptions, getDataUri, sendEmail } from "../utils/token.js";
import cloudinary from "cloudinary";
import crypto from "crypto";

const authController = {
  //@desc Post Register user
  async Register(req, res, next) {
    try {
      const { name, email, password, address, city, country, pinCode } =
        req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return next(new ErrorCatch("User Already Exist", 400));
      }

      let avatar = undefined;

      //Add cloundinary
      if (req.file) {
        const file = getDataUri(req.file);
        const myCloud = await cloudinary.v2.uploader.upload(file.content);

        avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_site,
        };
      }

      const user = await User.create({
        name,
        email,
        password,
        address,
        avatar,
        city,
        country,
        pinCode,
      });
      sendToken(user, res, `Registered successfully`, 201);
    } catch (error) {
      next();
    }
  },

  //@desc Post Login user
  async Login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorCatch("Incorrect Email or Password ", 400));
      }

      if (!password) {
        return next(new ErrorCatch("Please enter the Password ", 400));
      }

      //Handler error
      const isMatched = await user.comparePassword(password);
      if (!isMatched) {
        return next(new ErrorCatch("Incorrect Email or Password", 400));
      }

      sendToken(user, res, `Welcome Back, ${user.name}`, 200);
      next();
    } catch (error) {
      next();
    }
  },

  //@desc Get User Profile
  async Profile(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      res.status(200).json({
        success: true,
        user,
      });
      next();
    } catch (error) {
      throw new Error("Failed to get the Profile", error);
    }
  },

  //@desc Logout the User
  async Logout(req, res, next) {
    try {
      res
        .status(200)
        .cookie("token", "", {
          ...cookieOptions,
          expires: new Date(Date.now()),
        })
        .json({
          success: true,
          message: "Logged out successfully",
        });
      next();
    } catch (error) {
      throw new Error("Failed to logout", error);
    }
  },

  //@desc Update Profile
  async UpdateProfile(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      const { name, email, address, city, country, pinCode } = req.body;

      if (name) user.name = name;
      if (email) user.email = email;
      if (address) user.address = address;
      if (city) user.city = city;
      if (country) user.country = country;
      if (pinCode) user.pinCode = pinCode;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
      });
      next();
    } catch (error) {
      next(error);
    }
  },

  //@desc Update Password
  async UpdatePassword(req, res, next) {
    try {
      const user = await User.findById(req.user._id).select("+password");

      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || newPassword) {
        return next(
          new ErrorCatch(
            "Please enter the Old Password & the New Password",
            400
          )
        );
      }

      const isMatched = await user.comparePassword(password);

      if (isMatched) return next(new ErrorCatch("Incorrect old password", 400));
      user.password = newPassword;
      await user.save();
      res.json({
        success: true,
        message: "Password updated successfully",
      });
      next();
    } catch (error) {
      throw new Error(error, "Failed to update the profile");
    }
  },

  //@desc Get User Profile
  async UpdatePic(req, res, next) {
    try {
      const user = await User.findById(req.user._id);

      const file = getDataUri(req.file);

      await cloudinary.v2.uploader.destroy(user.avatar.public_id);

      const myCloud = await cloudinary.v2.uploader.upload(file.content);
      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_site,
      };

      await user.save();
      res.send({
        success: true,
        message: "Avatar Updated successfully",
      });

      next();
    } catch (error) {
      throw new Error("Failed to get the Profile", error);
    }
  },

  //@Forget Password
  async ForgetPassword(req, res, next) {

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return next(new ErrorCatch("Incorrect Email", 404));
    // max,min 2000,10000
    // math.random()*(max-min)+min

    const randomNumber = Math.random() * (999999 - 100000) + 100000;
    const otp = Math.floor(randomNumber);
    const otp_expire = 15 * 60 * 1000;

    user.otp = otp;
    user.otp_expire = new Date(Date.now() + otp_expire);
    await user.save();

    const message = `Your OTP for Reseting Password is ${otp}.\n Please ignore if you haven't requested this.`;
    try {
      await sendEmail("OTP For Reseting Password", user.email, message);
    } catch (error) {
      user.otp = null;
      user.otp_expire = null;
      await user.save();
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: `Email Sent To ${user.email}`,
    });
  },

  //@Reset Password
  async ResetPassword(req, res, next) {

    const { otp, password } = req.body;

    const user = await User.findOne({
      otp,
      otp_expire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return next(new ErrorCatch("Incorrect  OTP oir has been expired", 4000));
    }
    if(!password){
        return next(new ErrorCatch("Please enter a new password", 404));
    }
    user.password = password;
    user.otp = undefined;
    user.otp_expire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully, You can login now",
      });
  },
};

export default authController;
