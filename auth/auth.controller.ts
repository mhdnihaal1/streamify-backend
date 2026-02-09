import { Organization } from './../node_modules/.prisma/client/index.d';
 import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cookie from "cookie";
import { sendEmail } from "../services/sendEmail";

export const register = async (req: Request, res: Response) => {
    try {
  const { fullName ,email, password ,orgId, role} = req.body;
     if (!fullName || !email ||!password  || !role ) {
      return res.status(400).json({ message: "Please fill required fields" });
    }
     const hashedPassword = await bcrypt.hash(password, 10);
     const userExist = await prisma.user.findUnique({
      where: { email }, 
    }); 

     if (userExist) { 
      return res.status(401).json({ message: "User already exists" });
    }
  const user = await prisma.user.create({
    data: {
      name: fullName,
      email,
      password: hashedPassword,
      orgId  ,
      role
    },
  });

  res.json(user);
    }catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const userById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    console.log("Fetching user by ID:", userId);
     
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        org: true,
        ownedGroups:true,
        memberships: true,
        messages: true,
      },
    });
    console.log(123123123123)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addUser = async (req: Request, res: Response) => {
    try {
      console.log("Request body:", req.body.addData);
  const { fullName ,email, password ,orgId,group, role} = req.body.addData;
console.log(1, fullName ,email, password ,orgId,group, role,"")
      if (!fullName || !email ||!password || !role ) {
      return res.status(400).json({ message: "Please fill required fields" });
    }
// return
    const hashedPassword = await bcrypt.hash(password, 10);
     const userExist = await prisma.user.findUnique({
      where: { email }, 
    }); 

     if (userExist) { 
      return res.status(401).json({ message: "User already exists" });
    }
 const user = await prisma.user.create({
  data: {
    name: fullName,
    email,
    password: hashedPassword,
    orgId,
    role,
  },
});
//  if(role !== 'ADMIN'){
 const GrpMember = await prisma.groupMember.createMany({
  data: group.map((groupId:any) => ({
    userId: user.id,
    groupId: groupId, // or directly groupId
  })), 
  skipDuplicates: true, 
    });
//  }

 
await sendEmail(
  email,
  "Welcome to Kodds 🚀",
  `
  <h2>Hello ${fullName}</h2>
  <p>Your account has been created successfully.</p>
  <p>Role: ${role}</p>
  <p>Organization ID: ${orgId}</p>
  <p>You can now log in to your account and start using Kodds Link ${process.env.FRONTEND_URL}!</p>
  <p>Email: ${email}</p>
  <p>Password: ${password}</p>
  `
);

  res.json(user);
    }catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

 

export const login = async (req: Request, res: Response) => {
  try {
     const { email, password } = req.body;
      if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

     const user = await prisma.user.findUnique({
      where: { email }, 
    }); 
 
     if (!user) { 
      return res.status(401).json({ message: "Invalid credentials" });
    }

     const isPasswordValid = await bcrypt.compare(password, user.password);
 
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
 
      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

res.cookie("token", token, {
  httpOnly: true,                       // cannot be accessed via JS
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "lax",                       // prevent CSRF
  maxAge: 24 * 60 * 60 * 1000,           // 1 day in milliseconds
  path: "/",                             // cookie path
});



      return res.status(200).json({
        Success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const users = async (req: Request, res: Response) => {
  try {
   
const users = await prisma.user.findMany({
  include: {
    org: true,          // organization details
    GroupMember: true,  // groups the user belongs to
    Message: true,      // user messages
  },
});
     if (!users) { 
      return res.status(401).json({ message: "No users found" });
    }
 
  
      return res.status(200).json({
        Success: true,
      message: "Users fetched successfully",
      users
      });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
 
 export const orgUser = async (req: Request, res: Response) => {
  try {
   
   const { orgId } = req.body;
 // return 
     if (!orgId) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

     const org = await prisma.organization.findMany({
      where:{id :orgId},
      include:{
        users:true,
        groups:true
      }
     }); 
     if (!org) { 
      return res.status(401).json({ message: "No org found" });
    }
 
  
      return res.status(200).json({
        Success: true,
      message: "User fetched successfully",
      org
      });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  try {
 const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const otps = await prisma.otp.create({
      data: {
        email,  
        code: otpCode
       },
    });
     const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gpdndev@gmail.com",
        pass: "utqo bswo hccn gkpr",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const senderEmail = "gpdndev@gmail.com";

    await transporter.sendMail({
      from: `"Streamify" <${senderEmail}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otps}. It expires in 3 minutes.`,
      html: `<h2>Your OTP code is <b>${otps}</b></h2><p>It expires in 3 minutes.</p>`,
    });
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const verifyOtp = async (req: Request, res: Response) => {
  try {
  const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

const otpRecord = await prisma.otp.findFirst({
  where: {
    email: email,
  },
});    if (!otpRecord) {
      return res.status(400).json({ message: "OTP IS EXPIRED" });
    }

    if (otp !== otpRecord?.otp) {
      return res.status(400).json({ message: "Wrong otp" });
    } else {
 await prisma.otp.delete({
    where: {
      id: otpRecord.id,
    },
  });    }

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


