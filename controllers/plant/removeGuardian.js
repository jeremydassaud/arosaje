const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.update = async (req, res) => {
  const userIdFromToken = req.auth.userId;
  const plantId = parseInt(req.params.plantId);

  try {
    // Vérifiez si l'utilisateur a le droit de supprimer le gardien de la plante
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
      return res.status(404).json({ error: "Plante non trouvée" });
    }

    if (!plant.guardian) {
      return res
        .status(400)
        .json({ error: "La plante n'a pas de gardien à supprimer" });
    }

    if (isAdmin || userIdFromToken === plant.guardianId) {
      const updatedPlant = await prisma.plant.update({
        where: {
          id: plantId,
        },
        data: {
          guardianId: null, // Supprime le gardien en le remettant à null
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
        .json({ message: "Gardien supprimé avec succès", data: updatedPlant });
    }
  } catch (error) {
    console.error(
      "Error removing guardian:",
      error.message || "Internal Server Error"
    );
    res
      .status(500)
      .json({
        error: "Erreur lors de la suppression du gardien",
        details: error.message,
      });
  } finally {
    await prisma.$disconnect();
  }
};
