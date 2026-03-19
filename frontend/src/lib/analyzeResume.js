export async function analyzeResume(formData) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
      method: "POST",
      body: formData,
    });

    return await response.json();
  } catch (error) {
    return { error: "Failed to connect to analysis service." };
  }
}
