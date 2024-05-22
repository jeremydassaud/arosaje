const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.delete = async (req, res) => {
  console.log("delete address route", req);

  const addressId = parseInt(req.params.id);

  try {
    const userIdFromToken = req.auth.userId;
    const userRolesFromToken = req.auth.userRole;

    const isAdmin = await prisma.role.findUnique({
      where: {
        id: userRolesFromToken,
        content: "admin",
      },
    });

    const addressToDelete = await prisma.address.findUnique({
      where: { id: Number(addressId) },
    });

    if (isAdmin || addressToDelete.userId === userIdFromToken) {
      const deletedAddress = await prisma.address.delete({
        where: { id: Number(addressId) },
      });

      res
        .status(200)
        .json({ message: "address deleted", data: deletedAddress });
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.log("------------------------------------------------",error)
    res.status(500).json({
      error: "Error on the delete of the address",
      details: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
};
