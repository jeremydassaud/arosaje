const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.delete = async (req, res) => {
  const userIdFromToken = req.auth.userId;
  const plantId = parseInt(req.params.id);
  const type = req.params.type;

  try {
    const userRolesFromToken = req.auth.userRole;
    const isAdmin = await prisma.role.findUnique({
      where: {
        id: userRolesFromToken,
        content: "admin",
      },
    });

    let plantToDelete;

    if (type === "owned") {
      // Récupérer la plante possédée avec les détails de l'utilisateur
      plantToDelete = await prisma.plantOwned.findUnique({
        where: { id: plantId },
        include: {
          user: true,
        },
      });
    } else if (type === "guarded") {
      // Récupérer la plante gardée avec les détails de l'utilisateur
      plantToDelete = await prisma.plantGuarded.findUnique({
        where: { id: plantId },
        include: {
          user: true,
        },
      });
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    const userWhoOwnsPlant = plantToDelete.user.id;

    // Vérifier les autorisations
    if (isAdmin || userIdFromToken === userWhoOwnsPlant) {
      // Supprimer la plante possédée ou gardée en fonction du type
      if (type === "owned") {
        await prisma.plantOwned.delete({
          where: { id: plantId },
        });
      } else if (type === "guarded") {
        await prisma.plantGuarded.delete({
          where: { id: plantId },
        });
      }

      res.status(200).json({ message: "Plant deleted" });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error(
      "Error deleting plant:",
      error.message || "Internal Server Error"
    );
    res
      .status(500)
      .json({ error: "Error deleting plant", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
};
