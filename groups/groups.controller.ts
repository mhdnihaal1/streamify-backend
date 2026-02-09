import { GroupMember } from './../node_modules/.prisma/client/index.d';
import { Request, Response, text } from "express";
import { prisma } from "../prisma/client";

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const { name, userId } = req.body;
     const org = await prisma.organization.findFirst({
      where: { id:userId },
    });
   
    if (org) {
      return res.status(401).json({ message: "Organization already exists" });
    }
 
    const orgs = await prisma.organization.create({
      data: {
        name
      },
    });
  await prisma.user.update({
  where: { id: userId },  
  data: {
    orgId:orgs.id,  
  },
});
    res.json(orgs);
  } catch (error) {
    console.error("Organization creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, orgId, userId } = req.body;
console.log( name, orgId, userId )
    if (!name || !orgId || !userId) {
      return res
        .status(400)
        .json({ message: "name, orgId and userId are required" });
    }

    const existingGroup  = await prisma.group.findFirst({
      where: { name, orgId },
    });

    if (existingGroup ) {
      return res.status(401).json({ message: "Group already exists" });
    }
    const group = await prisma.group.create({
      data: {
        name,
        orgId,
        ownerId: userId,
      },
    }); 
     const groupMember = await prisma.groupMember.create({
      data: { userId, groupId:group.id },
    });

    res.status(201).json(group);
  } catch (error) {
    console.error("Group creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createMember = async (req: Request, res: Response) => {
  try {
    const { userId, groupId } = req.body;
    if (!userId || !groupId) {
      return res.status(400).json({
        message: "userId and groupId are required",
      });
    }

    const existMember = await prisma.groupMember.findFirst({
      where: { userId, groupId },
    });

    if (existMember) {
      return res
        .status(401)
        .json({ message: "User is already a member of this group" });
    }

    const groupMember = await prisma.groupMember.create({
      data: { userId, groupId },
    });

    res.json({ message: "Joined group", data: groupMember });
  } catch (error) {
    console.error("Group member creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  // senderId: string, groupId: string, text: string
  try {
    const { senderId, groupId, text } = req.body;
     if (!senderId || !groupId || !text) {
      return res.status(400).json({
        message: "senderId, groupId and text are required",
      });
    }

    const message = await prisma.message.create({
      data: { senderId, groupId, text },
    });

    res.json(message);
  } catch (error) {
    console.error("Message sending error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Organization = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.body;

    if (!adminId) {
      return res.status(400).json({
        message: "adminId is required",
      });
    }
     const organizations = await prisma.organization.findFirst({
      where: { adminId },
       include: {
        groups: true,
        users: true,
      },
    });
  
     
     return res.status(200).json({ Success: true, data: organizations });
  } catch (error) {
    console.error("Message sending error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const group = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    console.log("Received adminId:", userId);
     if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }
const groups = await prisma.groupMember.findMany({
  where:{userId:userId},
   include: {
    group: true,
    user: true 
  },
});

     return res.status(200).json({ Success: true, data: groups });
  } catch (error) {
    console.error("Message sending error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const groupMember = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    console.log("Received groupId12:", userId);
     if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      }); 
    }
  
const groupMember = await prisma.groupMember.findMany({
  where: {  userId: userId },
  include: { 
    user: true,
    group: true 
   },
});
console.log(123,groupMember)
     return res.status(200).json({ Success: true, data: groupMember });
  } catch (error) {
    console.error("Message sending error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const messages = async (req: Request, res: Response) => {
  try {
    const { groupId, userId } = req.body;
 
    if (!groupId) {
      return res.status(400).json({
        message: "groupId and userId are required",
      });
    }
    const messages = await prisma.message.findMany({
      where: { groupId },
    });

     return res.status(200).json({ Success: true, data: messages });
  } catch (error) {
    console.error("Message sending error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
 
export const addMembersToOrg = async (req: Request, res: Response) => {
  try {
    const { userIds, orgId } = req.body;

    if (!orgId || !userIds) {
      return res.status(400).json({ message: "Organization  ID required" });
    }

    // ✅ check org exists
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    }); 

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

     const updatedUsers = await prisma.user.updateMany({
      where: {
        id: { in: userIds },
      },
      data: {
        orgId: orgId,
       },
    });

    return res.status(200).json({
      message: "Users added to organization successfully",
      org: org,
    });
  } catch (error) {
    console.error("Add members error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const addMembersToGrp = async (req: Request, res: Response) => {
  try {
    const {  orgId ,userId ,groupId} = req.body;
     if (!orgId || !userId || !groupId) {
      return res.status(400).json({ message: "Organization, Group and User IDs are required" });
    }
     // ✅ check org exists
    const org = await prisma.organization.findFirst({
      where: { adminId: userId },
    });
 
     if (!org) {
      return res.status(404).json({ message: "You are not an Organization Admin" });
    }

     const GrpMember = await prisma.groupMember.createMany({
  data: groupId.map((groupId:any) => ({
    userId,
    groupId,
  })),
  skipDuplicates: true, 
    });
 await prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });
    return res.status(200).json({
      message: "Users added to group successfully",
      groupMember: GrpMember,
    });
  } catch (error) {
    console.error("Add members error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const grpMembers = async (req: Request, res: Response) => {
  try {
    const { groupId, userId ,role} = req.body;
        // const { id: userId, role } = req.user; // from auth middleware
console.log("User from token:", req.user);
   console.log("Received groupId:", groupId, "userId:", userId);
    if (!groupId) {
      return res.status(400).json({
        message: "groupId and userId are required",
      });
    }
    const member = await prisma.groupMember.findFirst({
      where: { groupId ,userId},
       include: {
        user: true,
        group: true,
      },
    });

//     if (!member) {
//   return res.status(403).json({
//     message: "You are not allowed to access this group",
//   });
// }

const members = await prisma.groupMember.findMany({
  where: { groupId },
  include: {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
    group:true,
  },
});



      return res.status(200).json({ Success: true, data: members });
  } catch (error) {
    console.error("Message sending error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const removeMember = async (req: Request, res: Response) => {
  try {
    const { userId, groupId, adminId } = req.body;

    if (!userId || !groupId || !adminId) {
      return res.status(400).json({
        message: "userId, groupId and adminId are required",
      });
    }

     const org = await prisma.organization.findFirst({
      where: { adminId },
    });

    if (!org) {
      return res.status(403).json({
        message: "Only organization admin can remove members",
      });
    }

    // ✅ Remove membership
    await prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    return res.status(200).json({
      message: "User removed from group successfully",
    });
  } catch (error) {
    console.error("Remove member error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
