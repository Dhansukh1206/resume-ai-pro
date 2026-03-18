export async function analyzeResume(formData) {
  try {
    const response = await fetch("http://localhost:5050/analyze", {
      method: "POST",
      body: formData,
    });

    return await response.json();
  } catch (error) {
    return { error: "Failed to connect to analysis service" };
  }
}
