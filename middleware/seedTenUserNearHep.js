async function HeptestUserSeeder() {
    let salt = bcrypt.genSaltSync(10);
  
    try {
      // Créer un utilisateur
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
            userName: `TestUser${i + 1}`,
            email: `test${i + 1}@example.com`,
            password: bcrypt.hashSync(`test${i + 1}`, salt),
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
      console.error("Seed fallback error:", error);
    } finally {
      await prisma.$disconnect();
    }
  }
  