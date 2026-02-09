import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {prisma} from "../prisma/client"; // adjust path

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
const authHeader = req.headers.authorization;
const token = authHeader?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
console.log(decoded);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔥 THIS IS THE KEY LINE
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
