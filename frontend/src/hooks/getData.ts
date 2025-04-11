export const revalidate = 10;
export async function getStrapiData(path: string) {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;
  try {
    const response = await fetch(baseUrl + path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { data: { attributes: {} }, link: baseUrl + path, error };
  }
}
