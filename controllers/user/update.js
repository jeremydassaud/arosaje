const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcryptjs");

exports.update = async (req, res) => {
  console.log("update user route",req);

  const userId = req.params.id;

  // regex
  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const regexUsername = /^[a-zA-Z0-9_-]+$/;

  const regexUppercase = /[A-Z]/;
  const regexLowercase = /[a-z]/;
  const regexSpecialcase = /[!@#$%^&*(),.?":{}|<>]/;
  const regexNumber = /\d/;

  try {
    const updatedUserData = req.body;
    const userIdFromToken = req.auth.userId;
    const userRolesFromToken = req.auth.userRole;

    const isAdmin = await prisma.role.findUnique({
      where: {
        id: userRolesFromToken,
        content: "admin",
      },
    });

    if (isAdmin || userIdFromToken === parseInt(userId)) {
      
      let updatedData = {};

      if (isAdmin && regexEmail.test(updatedUserData.email)) {
        updatedData.email = updatedUserData.email;
      }

      if (regexUsername.test(updatedUserData.userName)) {
        updatedData.userName = updatedUserData.userName;
      }

      if (updatedUserData.password) {
        const password = updatedUserData.password

        if (password.length < 7) {
          res.status(400).json({
            error: "password must be minimum with 8 char",
          });
        } else if (!regexUppercase.test(password)) {
          res.status(400).json({
            error: "password must contain an uppercase",
          });
        } else if (!regexLowercase.test(password)) {
          res.status(400).json({
            error: "password must contain a lowercase",
          });
        } else if (!regexSpecialcase.test(password)) {
          res.status(400).json({
            error: "password must contain a special char",
          });
        } else if (!regexNumber.test(password)) {
          res.status(400).json({
            error: "password must contain a number",
          });
        } else {const salt = bcrypt.genSaltSync(10);
          updatedData.password = bcrypt.hashSync(
            updatedUserData.password,
            salt
          );
        }
      }

      updatedData.imageSrc = updatedUserData.imageSrc;
      updatedData.plantOwned = updatedUserData.plantOwned;
      updatedData.plantGuarded = updatedUserData.plantGuarded;
      updatedData.address = updatedUserData.address;

      const updatedUser = await prisma.user.update({
        where: { id: Number(userId) },
        data: updatedData,
      });

      res.status(200).json({ message: "User updated", data: updatedUser });
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error(
      "Error on the update of the user:",
      error.message || "Internal Server Error"
    );
    res.status(500).json({
      error: "Error on the update of the user",
      details: "Internal Server Error",
    });
  } finally {
    console.log(res)
    await prisma.$disconnect();
  }
};
