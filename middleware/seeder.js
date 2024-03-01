const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seeder() {

  let salt = bcrypt.genSaltSync(10);

  try {

    // Create the role and the admin in the DB
    const adminRole = await prisma.role.create({
      data: {
        content: "admin",
      },
    });

    const userRole = await prisma.role.create({
      data: {
        content: "user",
      },
    });

    const botanistRole = await prisma.role.create({
      data: {
        content: "botanist",
      },
    });

    // create the admin account

    await prisma.user.create({
      data: {
        userName: "Admin",
        email: "admin@admin.com",
        password: bcrypt.hashSync("admin", salt),
        userRole: {
          create: {
            roleId: adminRole.id,
          },
        },
      },
    });
    console.log("seed created");

  } catch (error) {
    console.log("---------------- seed Fallback ----------------");
    console.log(error);
    console.log("---------------- seed Fallback ----------------");
  } finally {
    await prisma.$disconnect();
  }
}


async function testUserSeeder() {
  let salt = bcrypt.genSaltSync(10);

  try {
    // Create user
    const user = await prisma.user.create({
      data: {
        userName: "TestUser",
        email: "test@example.com",
        password: bcrypt.hashSync("test", salt),
        userRole: {
          create: {
            roleId: 2,
          },
        },
      },
    });

    // Create address
    const address = await prisma.address.create({
      data: {
        number: 1,
        street: "Test Street",
        postalCode: 12345,
        city: "Test City",
        country: "Test Country",
        lat: 45.764043,
        lng: 4.835659,
        userId: user.id,
      },
    });

    // Create plants within ±0.0009 of the address's lat and lng
    for (let i = 0; i < 10; i++) {
      const latOffset = Math.random() * 0.0018 - 0.0009;
      const lngOffset = Math.random() * 0.0018 - 0.0009;

      const plant = await prisma.plant.create({
        data: {
          common_name: `Plant ${i + 1}`,
          scientific_name: `Scientificus ${i + 1}`,
          image_url: `https://cdn.pixabay.com/photo/2024/01/04/09/34/plant-8486960_960_720.png`,
          address: {
            connect: {
              id: address.id,
            },
          },
          owner: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }

    console.log("Seed testUser created successfully");

  } catch (error) {
    console.error("Seed fallback error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function HeptestUserSeeder() {
  let salt = bcrypt.genSaltSync(10);

  try {
    // Créer un utilisateur
    const user = await prisma.user.create({
      data: {
        userName: "TestHep",
        email: "testhep@example.com",
        password: bcrypt.hashSync("test", salt),
        userRole: {
          create: {
            roleId: 2,
          },
        },
      },
    });

    // Créer l'adresse principale
    const address = await prisma.address.create({
      data: {
        number: 1,
        street: "Test Street",
        postalCode: 12345,
        city: "Test City",
        country: "Test Country",
        lat: 45.764043,
        lng: 4.835659,
        userId: user.id,
      },
    });

    console.log("Seed testUser created successfully");

    // Créer des utilisateurs supplémentaires avec des adresses proches
    for (let i = 0; i < 10; i++) {
      const newUser = await prisma.user.create({
        data: {
          userName: `TestUserHep${i + 1}`,
          email: `testhep${i + 1}@example.com`,
          password: bcrypt.hashSync(`testhep${i + 1}`, salt),
          userRole: {
            create: {
              roleId: 2,
            },
          },
        },
      });

      const latOffset = Math.random() * 0.0018 - 0.0009;
      const lngOffset = Math.random() * 0.0018 - 0.0009;

      const newAddress = await prisma.address.create({
        data: {
          number: 1,
          street: "Test Street",
          postalCode: 12345,
          city: "Test City",
          country: "Test Country",
          lat: 45.7753924 + latOffset,
          lng: 4.799698299999999 + lngOffset,
          userId: newUser.id,
        },
      });

      // Créer des plantes pour chaque utilisateur
      for (let j = 0; j < 5; j++) {
        const plant = await prisma.plant.create({
          data: {
            common_name: `Plant ${j + 1}`,
            scientific_name: `Scientificus ${j + 1}`,
            image_url: `https://cdn.pixabay.com/photo/2024/01/04/09/34/plant-8486960_960_720.png`,
            address: {
              connect: {
                id: newAddress.id,
              },
            },
            owner: {
              connect: {
                id: newUser.id,
              },
            },
          },
        });
      }

      console.log(`Seed testUser${i + 1} created successfully`);
    }

  } catch (error) {
    console.error("Seed test HEP fallback error:", error);
  } finally {
    await prisma.$disconnect();
  }
}


module.exports = { seeder, testUserSeeder, HeptestUserSeeder}