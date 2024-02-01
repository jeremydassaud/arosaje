const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.delete = async (req, res) => {
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

    const commentToDelete = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        plant: {
          include: {
            plantOwned: {
              include: {
                user: true, 
              },
            },
          },
        },
      },
    });

    const userWhoOwnsPlant = commentToDelete.plant.plantOwned.user.id;

    // Vérifier les autorisations
    if (isAdmin || userIdFromToken === userWhoOwnsPlant) {
      // Supprimer le commentaire
      const deletedComment = await prisma.comment.delete({
        where: { id: commentId },
      });

      res.status(200).json({ message: "Comment deleted", data: deletedComment });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error(
      "Error deleting comment:",
      error.message || "Internal Server Error"
    );
    res
      .status(500)
      .json({ error: "Error deleting comment", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
};
