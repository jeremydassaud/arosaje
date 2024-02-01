const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
  const userId = parseInt(req.params.id);
  const type = req.params.type;  // Ajout du paramètre de type

  try {
    const { common_name, scientific_name, image_url, addressId } = req.body;

    const userIdFromToken = req.auth.userId;
    const userRolesFromToken = req.auth.userRole;

    const isAdmin = await prisma.role.findUnique({
      where: {
        id: userRolesFromToken,
        content: "admin",
      },
    });

    if (isAdmin || userIdFromToken === userId) {
      let newPlant;

      if (type === "owned") {
        // Créer une plante possédée
        newPlant = await prisma.plant.create({
          data: {
            common_name,
            scientific_name,
            image_url,
            address: {
              connect: {
                id: addressId,
              },
            },
            plantOwned: {
              create: {
                userId,
              },
            },
          },
        });
      } else if (type === "guarded") {
        // Créer une plante gardée
        newPlant = await prisma.plant.create({
          data: {
            common_name,
            scientific_name,
            image_url,
            address: {
              connect: {
                id: addressId,
              },
            },
            plantGuarded: {
              create: {
                userId,
              },
            },
          },
        });
      } else {
        return res.status(400).json({ error: "Invalid type" });
      }

      res.status(201).json({ message: "Plant created", data: newPlant });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error(
      "Error creating plant:",
      error.message || "Internal Server Error"
    );
    res
      .status(500)
      .json({ error: "Error creating plant", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
};
