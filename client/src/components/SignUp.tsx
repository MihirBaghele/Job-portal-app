import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { validatePassword } from "../utils/passwordValidation";
import 'react-toastify/dist/ReactToastify.css';


interface FormDataType {
  name: string;
  email: string;
  user_id: string;
  password: string;
  phone: string;
  skills: string;
  experience: string;
  dob: string;
  address: string;
  education: string;
  resume: string;
}

const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string,
  additionalFields?: Record<string, string>
) => {
  try {
    const requestBody = {
      name,
      email,
      password,
      role,
      ...additionalFields
    };

    const response = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
};

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "candidate";
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    user_id: "",
    password: "",
    phone: "",
    skills: "",
    experience: "",
    dob: "",
    address: "",
    education: "",
    resume: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    try {
      await registerUser(
        formData.name,
        formData.email,
        formData.password,
        role,
        role === "candidate" ? {
          phone: formData.phone,
          skills: formData.skills,
          experience: formData.experience,
          dob: formData.dob,
          address: formData.address,
          education: formData.education,
          resume: formData.resume,
          user_id: formData.user_id
        } : { user_id: formData.user_id }
      );

      toast.success("Signup successful! Please log in.");
      setTimeout(() => navigate("/"), 3000); // Delay redirect for better UX
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <span className="text-2xl font-bold text-white">Info Origin</span>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-white bg-blue-600 px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-blue-700 transition hover:shadow-lg"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 2L2 8h3v8h4V12h2v4h4V8h3L10 2z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold text-sm md:text-base">Home</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex justify-center">
        <div className={`bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full ${role === "candidate" ? "max-w-4xl" : "max-w-2xl"}`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
            Sign Up as {role === "candidate" ? "Candidate" : "Recruiter"}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm md:text-base font-medium mb-1">Name*</label>
                <input
                  type="text"
                  name="name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm md:text-base font-medium mb-1">Email*</label>
                <input
                  type="email"
                  name="email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm md:text-base font-medium mb-1">User ID*</label>
                <input
                  type="text"
                  name="user_id"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.user_id}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm md:text-base font-medium mb-1">Password*</label>
                <input
                  type="password"
                  name="password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.
                </p>
              </div>
            </div>

            {role === "candidate" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm md:text-base font-medium mb-1">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm md:text-base font-medium mb-1">Skills</label>
                    <input
                      type="text"
                      name="skills"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm md:text-base font-medium mb-1">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm md:text-base font-medium mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm md:text-base font-medium mb-1">Address</label>
                    <textarea
                      name="address"
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm md:text-base font-medium mb-1">Education</label>
                      <input
                        type="text"
                        name="education"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.education}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm md:text-base font-medium mb-1">Resume (URL or Text)</label>
                      <input
                        type="text"
                        name="resume"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.resume}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition transform hover:scale-[1.01]"
              >
                Sign Up
              </button>

              <div className="text-center mt-4 text-sm md:text-base">
                Already have an account?{" "}
                <a href="/" className="text-blue-600 hover:underline font-medium">
                  Log In
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default SignUp;