import axios from "axios";

// Create an Axios instance with base settings
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Ensures consistent base URL
  headers: { "Content-Type": "application/json" },
});



// ✅ Get Candidate Info by ID
export const getCandidateById = async (id: string) => {
  try {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("🛑 Fetch Candidate Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Failed to fetch candidate details");
    } else {
      console.error("🛑 Unexpected Error:", error);
      throw new Error("Something went wrong");
    }
  }
};





export default api;
