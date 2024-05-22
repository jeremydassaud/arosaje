const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.update = async (req, res) => {
  console.log("plant addguardian route", req)
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

    if (plant.guardian) {
      return res.status(400).json({ error: "Plant already have a guardian" });
    }

    const updatedPlant = await prisma.plant.update({
      where: {
        id: plantId,
      },
      data: {
        guardianId: userIdFromToken,
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
      .json({ message: "Gardian added ", data: updatedPlant });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error adding guardian",
        details: error.message,
      });
  } finally {
    await prisma.$disconnect();
  }
};
