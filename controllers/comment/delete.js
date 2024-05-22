const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.delete = async (req, res) => {
  console.log("delete comment route", req);
  try {
    const commentId = parseInt(req.params.commentId);

    const userIdFromToken = req.auth.userId;
    const userRolesFromToken = req.auth.userRole;

    const isAdmin = await prisma.role.findUnique({
      where: {
        id: userRolesFromToken,
        content: "admin",
      },
    });

    const commentToDelet = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!commentToDelet) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (isAdmin || commentToDelet.userId === userIdFromToken) {
      const deletedComment = await prisma.comment.delete({
        where: { id: commentId },
      });

      res.status(200).json({ message: "Comment deleted", data: deletedComment });
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error(
      "Error deleting comment:",
      error.message || "Internal Server Error"
    );
    res.status(500).json({ error: "Error deleting comment", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
};
