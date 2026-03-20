import axios from "axios";

export async function analyzeResume(formData) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/analyze`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Analysis request failed:", error);

    if (error.response) {
      return {
        error: error.response.data?.message || "Server error occurred.",
      };
    } else if (error.request) {
      return {
        error: "Failed to connect to analysis service. Please try again.",
      };
    } else {
      return { error: "An unexpected error occurred." };
    }
  }
}
