-- CreateTable
CREATE TABLE "BannerSettings" (
    "shop" TEXT NOT NULL,
    "bannerText" TEXT NOT NULL DEFAULT 'We use cookies to improve your experience. By using our site, you agree to our use of cookies.',
    "acceptText" TEXT NOT NULL DEFAULT 'Accept',
    "rejectText" TEXT NOT NULL DEFAULT 'Reject',
    "customizeText" TEXT NOT NULL DEFAULT 'Customize',
    "position" TEXT NOT NULL DEFAULT 'bottom',
    "bgColor" TEXT NOT NULL DEFAULT '#1a1a1a',
    "textColor" TEXT NOT NULL DEFAULT '#ffffff',
    "buttonColor" TEXT NOT NULL DEFAULT '#00a86b',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BannerSettings_pkey" PRIMARY KEY ("shop")
);
