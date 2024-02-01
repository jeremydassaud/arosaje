const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUser = require("./controllers/user/signup");
const createAddress = require("./controllers/address/create");
const createPlant = require("./controllers/plant/create");
const createComment = require("./controllers/comment/create");

// Utilisez Jest pour créer des tests
describe("Scénario de test complet", () => {
  let userId, addressId, plantId, commentId;

  // Avant chaque test, créez un utilisateur et une adresse
  beforeEach(async () => {
    const user = await createUser.signup({
      email: "john.doe@example.com",
      password: "Test123456789!",
    });
    userId = user.id;

    const address = await createAddress.create(userId, {
      number: 123,
      street: "Example Street",
      postalCode: 12345,
      city: "Example City",
      country: "Example Country",
      lat: 40.7128,
      lng: -74.006,
    });
    addressId = address.id;
  });

  // Testez la création d'une plante détenue
  test("Création d'une plante détenue", async () => {
    const plant = await createPlant.create(userId, {
      common_name: "Rose",
      scientific_name: "Rosa",
      image_url: "https://example.com/rose.jpg",
      addressId: addressId,
    });
    plantId = plant.id;

    expect(plant).toHaveProperty("common_name", "Rose");
    expect(plant).toHaveProperty("scientific_name", "Rosa");
    expect(plant).toHaveProperty("image_url", "https://example.com/rose.jpg");
  });

  // Testez la création d'un commentaire sur la plante détenue
  test("Création d'un commentaire sur la plante détenue", async () => {
    const comment = await createComment.create(userId, "owned", plantId, {
      content: "C'est une belle plante !",
    });
    commentId = comment.id;

    expect(comment).toHaveProperty("content", "C'est une belle plante !");
  });

  // Après chaque test, nettoyez les données créées
  afterEach(async () => {
    // Supprimez le commentaire
    await prisma.comment.deleteMany({
      where: { id: commentId },
    });

    // Supprimez la plante détenue
    await prisma.plantOwned.deleteMany({
      where: { plantId: plantId },
    });

    // Supprimez l'adresse
    await prisma.address.deleteMany({
      where: { id: addressId },
    });

    // Supprimez l'utilisateur
    await prisma.user.deleteMany({
      where: { id: userId },
    });
  });
});
