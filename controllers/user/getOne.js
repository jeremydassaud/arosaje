const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getOne = async (req, res) => {
  console.log("getOne user route");
  const id = parseInt(req.params.id);

  try {
    const users = await prisma.user.findUnique({
      where: { id: id },
      select: {
        userName: true,
        email: true,
        plantOwned: true,
        plantGuarded: true,
        address: true,
      },
    });
    if (!users) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "User not found" });
  } finally {
    await prisma.$disconnect();
  }
};
