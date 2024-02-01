const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll= async (req, res) => {
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
    console.error("Error retrieving plants:", error.message || "Internal Server Error");
    res.status(500).json({ error: "Error retrieving plants", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
};
