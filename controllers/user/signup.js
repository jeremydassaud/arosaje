const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

// create user
exports.signup = async (req, res) => {
  console.log("signup user route",req);

  const regexUppercase = /[A-Z]/;
  const regexLowercase = /[a-z]/;
  const regexSpecialcase = /[!@#$%^&*(),.?":{}|<>]/;
  const regexNumber = /\d/;

  let salt = bcrypt.genSaltSync(10);

  const defaultRole = await prisma.role.findUnique({
    where: {
      content: "user",
    },
  });

  try {
    const { email, password } = req.body;
    if (password.length < 7) {
      res.status(412).json({
        error: "password must be minimum with 8 char",
      });
    } else if (!regexUppercase.test(password)) {
      res.status(412).json({
        error: "password must contain an uppercase",
      });
    } else if (!regexLowercase.test(password)) {
      res.status(412).json({
        error: "password must contain a lowercase",
      });
    } else if (!regexSpecialcase.test(password)) {
      res.status(412).json({
        error: "password must contain a special char",
      });
    } else if (!regexNumber.test(password)) {
      res.status(412).json({
        error: "password must contain a number",
      });
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, salt),
          userRole: {
            create: {
              roleId: defaultRole.id,
            },
          },
        },
      });
      res.status(200).json({ message: "User created" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Can't create a user please verify the log of your server",
    });
  } finally {
    await prisma.$disconnect();
  }
};
