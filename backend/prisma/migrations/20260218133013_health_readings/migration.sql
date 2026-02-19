-- CreateTable
CREATE TABLE "HealthReading" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight_kg" DOUBLE PRECISION NOT NULL,
    "body_fat_percent" DOUBLE PRECISION,
    "muscle_mass_kg" DOUBLE PRECISION,
    "bmi" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HealthReading_user_id_idx" ON "HealthReading"("user_id");

-- CreateIndex
CREATE INDEX "HealthReading_recorded_at_idx" ON "HealthReading"("recorded_at");

-- AddForeignKey
ALTER TABLE "HealthReading" ADD CONSTRAINT "HealthReading_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
