const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
  console.log("getAll user route", req);
  try {
    const users = await prisma.user.findMany({
      select: {
        userName: true,
        email: true,
        address: true,
        plantsOwned: {
          include: {
            comment: true
          }
        },
        plantsGuarded: {
          include: {
            comment: true
          }
        }
      },
    });

    if (users.length === 0) { // Vérifie si le tableau des utilisateurs est vide
      res.status(404).json({ error: "Users not found" });
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
