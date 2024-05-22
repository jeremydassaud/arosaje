// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// exports.getAll= async (req, res) => {
//   console.log("get all plant from coordinates route",req)
//   try {
//     const { lat, lng } = req.params;

//     const minLat = parseFloat(lat) - 0.0009;
//     const maxLat = parseFloat(lat) + 0.0009;
//     const minLng = parseFloat(lng) - 0.0009;
//     const maxLng = parseFloat(lng) + 0.0009;

//     const plants = await prisma.plant.findMany({
//       where: {
//         address: {
//           AND: [
//             { lat: { gte: minLat } },
//             { lat: { lte: maxLat } },
//             { lng: { gte: minLng } },
//             { lng: { lte: maxLng } },
//           ],
//         },
//       },
//       include: {
//         address: true,
//       },
//     });

//     res.status(200).json({ message: "Plants retrieved", data: plants });
//   } catch (error) {
//     res.status(500).json({ error: "Error retrieving plants", details: error.message });
//   } finally {
//     console.log(res)
//     await prisma.$disconnect();
//   }
// };

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
  console.log("get all plant from coordinates route", req);
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
      include: {
        address: true,
        owner: true, 
      },
    });

    const groupedPlants = plants.reduce((acc, plant) => {
      const key = `${plant.ownerId}_${plant.addressId}`;
      if (!acc[key]) {
        acc[key] = {
          userId: plant.ownerId,
          addressId: plant.addressId,
          address: plant.address,
          owner: plant.owner,
          plants: [],
        };
      }
      acc[key].plants.push({
        id: plant.id,
        common_name: plant.common_name,
        scientific_name: plant.scientific_name,
        image_url: plant.image_url,
        ownerId: plant.ownerId,
        guardianId: plant.guardianId,
        addressId: plant.addressId,
        createdAt: plant.createdAt,
        updatedAt: plant.updatedAt,
      });
      return acc;
    }, {});

    const groupedPlantsArray = Object.values(groupedPlants);

    res.status(200).json({ message: "Plants retrieved", data: groupedPlantsArray });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving plants", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
};

