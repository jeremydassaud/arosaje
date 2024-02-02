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
  }
}

seeder()