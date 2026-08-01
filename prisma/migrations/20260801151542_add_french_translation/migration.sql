-- AlterTable
ALTER TABLE "BannerSettings" ADD COLUMN     "acceptTextFr" TEXT NOT NULL DEFAULT 'Accepter',
ADD COLUMN     "bannerTextFr" TEXT NOT NULL DEFAULT 'Nous utilisons des cookies pour améliorer votre expérience. En utilisant notre site, vous acceptez notre utilisation des cookies.',
ADD COLUMN     "customizeTextFr" TEXT NOT NULL DEFAULT 'Personnaliser',
ADD COLUMN     "rejectTextFr" TEXT NOT NULL DEFAULT 'Refuser';
