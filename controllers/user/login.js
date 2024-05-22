const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//logOne

exports.login = async (req, res) => {
    console.log("login user route",req);
  
    try {
      const { email, password } = req.body;
  
      const user = await prisma.user.findUnique({
        where: { email },
        include: { userRole: true },
      });
  
      if (user) {
        const isPasswordValid = bcrypt.compareSync(password, user.password);
  
        if (!isPasswordValid) {
          res.status(401).json({ error: "not allowed" });
        } else {
          const token = jwt.sign({ userId: user.id  , role: user.userRole[0].roleId}, process.env.jwtSignSecret, {
            expiresIn: "1h",
          });
          res.status(200).json({ token });
        }
      } else {
        res.status(404).json({ error: "user not found" });
      }
    } catch (error) {
      res.status(404).json({ error });
    } finally {
      await prisma.$disconnect();
    }
  };