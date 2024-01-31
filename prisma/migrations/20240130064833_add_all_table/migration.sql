/*
  Warnings:

  - Added the required column `lat` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "common_name" TEXT NOT NULL,
    "scientific_name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "plantOwnedId" INTEGER NOT NULL,
    "plantGuardedId" INTEGER,
    "addressId" INTEGER NOT NULL,
    CONSTRAINT "Plant_plantOwnedId_fkey" FOREIGN KEY ("plantOwnedId") REFERENCES "PlantOwned" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Plant_plantGuardedId_fkey" FOREIGN KEY ("plantGuardedId") REFERENCES "PlantGuarded" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Plant_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plantId" INTEGER,
    "responseId" INTEGER,
    CONSTRAINT "Comment_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Response" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "postalCode" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("city", "country", "id", "number", "postalCode", "street", "userId") SELECT "city", "country", "id", "number", "postalCode", "street", "userId" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
