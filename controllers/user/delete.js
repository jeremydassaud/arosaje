const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.delete = async (req, res) => {
  console.log("delete user route",req);

  const userId = req.params.id;

  try {
    const userIdFromToken = req.auth.userId;
    const userRolesFromToken = req.auth.userRole;

    const isAdmin = await prisma.role.findUnique({
      where: {
        id: userRolesFromToken,
        content: "admin",
      },
    });

    if (isAdmin || userIdFromToken === parseInt(userId)) {

      const deletedUser = await prisma.user.delete({
        where: { id: Number(userId) },
      });

      res.status(200).json({ message: "User deleted", data: deletedUser });
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error on the delete of the user",
      details: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
};

  