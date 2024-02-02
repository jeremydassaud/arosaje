const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll= async (req, res) => {
  console.log("get all plant from coordinates route",req)
  try {
    const { lat, lng } = req.params;

    const minLat = parseFloat(lat) - 0.0009;
    const maxLat = parseFloat(lat) + 0.0009;
    const minLng = parseFloat(lng) - 0.0009;
    const maxLng = parseFloat(lng) + 0.0009;

    const plants = await prisma.plant.findMany({
      where: {
        address: {
          AND: [
            { lat: { gte: minLat } },
            { lat: { lte: maxLat } },
            { lng: { gte: minLng } },
            { lng: { lte: maxLng } },
          ],
        },
      },
    });

    res.status(200).json({ message: "Plants retrieved", data: plants });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving plants", details: error.message });
  } finally {
    console.log(res)
    await prisma.$disconnect();
  }
};
