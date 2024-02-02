const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
  const userIdFromToken = req.auth.userId;

  try {
    // Vérifiez si l'utilisateur a le droit de créer une plante
    const isAdmin = await prisma.role.findUnique({
      where: {
        id: req.auth.userRole,
        content: "admin",
      },
    });

    if (isAdmin || userIdFromToken === parseInt(req.params.id)) {
      const { common_name, scientific_name, image_url, addressId } = req.body;

      const newPlant = await prisma.plant.create({
        data: {
          common_name,
          scientific_name,
          image_url,
          owner: { connect: { id: userIdFromToken } },
          address: {
            connect: {
              id: addressId,
            },
          },
        },
        include: {
          owner: true,
          guardian: true,
          address: true,
          comment: true,
        },
      });

      res
        .status(201)
        .json({ message: "Plante créée avec succès", data: newPlant });
    } else {
      res.status(401).json({ error: "Non autorisé à créer une plante" });
    }
  } catch (error) {
    console.error(
      "Error creating plant:",
      error.message || "Internal Server Error"
    );
    res
      .status(500)
      .json({
        error: "Erreur lors de la création de la plante",
        details: error.message,
      });
  } finally {
    await prisma.$disconnect();
  }
};
