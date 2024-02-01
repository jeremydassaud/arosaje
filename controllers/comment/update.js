const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.update = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const commentId = parseInt(req.params.commentId);

    const userIdFromToken = req.auth.userId;
    const userRolesFromToken = req.auth.userRole;

    const isAdmin = await prisma.role.findUnique({
      where: {
        id: userRolesFromToken,
        content: "admin",
      },
    });

    if (isAdmin || userIdFromToken === userId) {
      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          content: req.body.content,
        },
      });

      res.status(200).json({ message: "Comment updated", data: updatedComment });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error(
      "Error updating comment:",
      error.message || "Internal Server Error"
    );
    res
      .status(500)
      .json({ error: "Error updating comment", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
};
