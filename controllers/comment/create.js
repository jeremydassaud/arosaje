const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.create = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const plantId = parseInt(req.params.plantId);

    const newComment = await prisma.comment.create({
      data: {
        content: req.body.content,
        plant: {
          connect: {
            id: plantId,
          },
        },
        User: {
          connect: {
            id: userId
          }
        }
      },
    });

    res.status(201).json({ message: "Comment created", data: newComment });
  } catch (error) {
    console.error(
      "Error creating comment:",
      error.message || "Internal Server Error"
    );
    res
      .status(500)
      .json({ error: "Error creating comment", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
};

 