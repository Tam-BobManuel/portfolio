import { getStrapiData } from "@/hooks/getData";
import HomeClient from "@/modules/HomePage";

export const revalidate = 10;

export default async function HomePage() {
  // Fetch data on the server
  const strapiData = await getStrapiData(
    `${process.env.NEXT_PUBLIC_HOMEPAGE_ENDPOINT}`
  );
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;
  
  // Process hero image URL
  let heroImageUrl: string | null = null;
  try {
    if (strapiData.data[0]?.HeroImg?.url) {
      heroImageUrl = baseUrl + strapiData.data[0].HeroImg.url;
    }
  } catch (error) {
    console.log("Error accessing DB image:", error);
  }

  // Process hero text from backend
  let words: string[] = [" ", "creative", "beautiful", "modern", "reliable"]; // Default values
  try {
    const heroTextData = strapiData.data[0]?.HeroText;
    if (heroTextData && Array.isArray(heroTextData) && heroTextData.length > 0) {
      words = [" ", ...heroTextData.map((item) => item.Text)];
    }
  } catch (error) {
    console.log("Error processing hero text:", error);
  }

  // Pass data to client component
  return <HomeClient heroImageUrl={heroImageUrl} words={words} />;
}