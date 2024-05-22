const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
  console.log("create address route",req)
  const userId = req.params.userId;

  try {
    const { number, street, postalCode, city, country, lat, lng } =
      req.body;

    const userIdFromToken = req.auth.userId;
    const userRolesFromToken = req.auth.userRole;

    const isAdmin = await prisma.role.findUnique({
      where: {
        id: userRolesFromToken,
        content: "admin",
      },
    }); 
    if (isAdmin || userIdFromToken === parseInt(userId)) {

      const newAddress = await prisma.address.create({
        data: {
          number,
          street,
          postalCode,
          city,
          country,
          lat,
          lng,
          userId : parseInt(userId),
        },
      });

      res.status(201).json({ message: "Address created", data: newAddress });
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: "Error unable to create the address",
      details: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
};
