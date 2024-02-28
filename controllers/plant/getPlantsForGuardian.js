const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fonction pour récupérer les plantes proposées à garder par un utilisateur spécifique à une adresse spécifique
exports.getAll = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const addressId = parseInt(req.params.addressId);

    // Récupérer les plantes proposées à garder par l'utilisateur spécifié à l'adresse spécifiée
    const plantsForGuardian = await prisma.plant.findMany({
      where: {
        ownerId : userId,
        addressId : addressId,
      },
      include :{
        owner:true,
        comment:true
      }
    });

    res
      .status(200)
      .json({
        message: "Plantes proposées à garder récupérées",
        data: plantsForGuardian,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Erreur lors de la récupération des plantes proposées à garder",
        details: error.message,
      });
  }
};
