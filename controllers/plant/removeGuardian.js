const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.update = async (req, res) => {
  console.log("update plant remove guardian route" ,req)
  const userIdFromToken = req.auth.userId;
  const plantId = parseInt(req.params.plantId);

  try {
    const isAdmin = await prisma.role.findUnique({
      where: {
        id: req.auth.userRole,
        content: "admin",
      },
    });

    const plant = await prisma.plant.findUnique({
      where: {
        id: plantId,
      },
      include: {
        owner: true,
        guardian: true,
        address: true,
        comment: true,
      },
    });

    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }

    if (!plant.guardian) {
      return res
        .status(400)
        .json({ error: "plant doesn't have guardian" });
    }

    if (isAdmin || userIdFromToken === plant.guardianId) {
      const updatedPlant = await prisma.plant.update({
        where: {
          id: plantId,
        },
        data: {
          guardianId: null,
        },
        include: {
          owner: true,
          guardian: true,
          address: true,
          comment: true,
        },
      });

      res
        .status(200)
        .json({ message: "Gardian deleted", data: updatedPlant });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error guardian could not been deleted",
        details: error.message,
      });
  } finally {
    await prisma.$disconnect();
  }
};
