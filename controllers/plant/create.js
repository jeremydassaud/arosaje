const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
  console.log("create plant route", req)
  
  const userIdFromToken = req.auth.userId;

  try {
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
        .json({ message: "Plante created", data: newPlant });
    } else {
      res.status(401).json({ error: "Unauthorize" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error creating plant",
        details: error.message,
      });
  } finally {
    await prisma.$disconnect();
  }
};
