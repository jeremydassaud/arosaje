const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
  console.log("getAll user route");
  try {
    const users = await prisma.user.findMany({
      select: {
        userName: true,
        email: true,
        address: true,
        plantsOwned :true,
        plantsGuarded :true
      },
    });

    if (!users) {
      res.status(404).json({ error: "Users not found" });
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Users not found" });
  } finally {
    await prisma.$disconnect();
  }
};
