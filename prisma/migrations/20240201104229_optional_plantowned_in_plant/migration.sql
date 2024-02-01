-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "common_name" TEXT NOT NULL,
    "scientific_name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "plantOwnedId" INTEGER,
    "plantGuardedId" INTEGER,
    "addressId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Plant_plantOwnedId_fkey" FOREIGN KEY ("plantOwnedId") REFERENCES "PlantOwned" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Plant_plantGuardedId_fkey" FOREIGN KEY ("plantGuardedId") REFERENCES "PlantGuarded" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Plant_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Plant" ("addressId", "common_name", "createdAt", "id", "image_url", "plantGuardedId", "plantOwnedId", "scientific_name", "updatedAt") SELECT "addressId", "common_name", "createdAt", "id", "image_url", "plantGuardedId", "plantOwnedId", "scientific_name", "updatedAt" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
