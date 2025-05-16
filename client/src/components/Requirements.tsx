import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Axios instance
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaUserTie, FaClipboardList, FaBriefcase } from "react-icons/fa";

interface JobRequirement {
  id: number;
  title: string;
  description: string;
  location: string;
  work_location_type: "On-site" | "Hybrid" | "Remote";
  experience_required: number;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  skills?: string | null;
  experience?: string | null;
  dob?: string | null;
  address?: string | null;
  education?: string | null;
  resume?: string | null;
  applied_requirement_ids?: string[] | null;
}

const Requirements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"requirements" | "candidates">("requirements");
  const [requirements, setRequirements] = useState<JobRequirement[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [workLocationType, setWorkLocationType] = useState<"On-site" | "Hybrid" | "Remote">("On-site");
  const [experienceRequired, setExperienceRequired] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<JobRequirement | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  // Candidate form states
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [candidateSkills, setCandidateSkills] = useState("");
  const [candidateExperience, setCandidateExperience] = useState("");
  const [candidateDob, setCandidateDob] = useState("");
  const [candidateAddress, setCandidateAddress] = useState("");
  const [candidateEducation, setCandidateEducation] = useState("");
  const [candidateResume, setCandidateResume] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchRequirements();
    fetchCandidates();
  }, []);

  const fetchRequirements = async () => {
    try {
      const response = await api.get("/requirements/all");
      setRequirements(response.data);
    } catch (error) {
      console.error("Error fetching job requirements:", error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await api.get("/candidates/all");
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const openCandidateEditModal = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setCandidateName(candidate.name);
    setCandidateEmail(candidate.email);
    setCandidatePhone(candidate.phone);
    setCandidateSkills(candidate.skills || "");
    setCandidateExperience(candidate.experience || "");
    setCandidateDob(candidate.dob || "");
    setCandidateAddress(candidate.address || "");
    setCandidateEducation(candidate.education || "");
    setCandidateResume(candidate.resume || "");
    setIsModalOpen(true);
  };

  const handleUpdateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;
    try {
      const updatedCandidate = {
        name: candidateName,
        email: candidateEmail,
        phone: candidatePhone,
        skills: candidateSkills,
        experience: candidateExperience,
        dob: candidateDob || null,
        address: candidateAddress || null,
        education: candidateEducation || null,
        resume: candidateResume || null,
      };
      await api.put(`/candidates/update/${editingCandidate.id}`, updatedCandidate);
      setCandidates(candidates.map(c =>
        c.id === editingCandidate.id ? { ...c, ...updatedCandidate } : c
      ));
      resetForm();
    } catch (error) {
      console.error("Error updating candidate:", error);
    }
  };

  const handleAddOrEditRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRequirement) {
        await api.put(`/requirements/update/${editingRequirement.id}`, {
          title,
          description,
          location,
          work_location_type: workLocationType,
          experience_required: experienceRequired
        });

        // Update state immediately
        setRequirements(requirements.map(req =>
          req.id === editingRequirement.id
            ? { ...req, title, description, location, work_location_type: workLocationType, experience_required: experienceRequired }
            : req
        ));
      } else {
        const response = await api.post("/requirements/add", {
          title,
          description,
          location,
          work_location_type: workLocationType,
          experience_required: experienceRequired
        });

        // Add the new requirement to the list
        setRequirements([...requirements, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving job requirement:", error);
    }
  };

  const handleDeleteRequirement = async (id: number) => {
    try {
      await api.delete(`/requirements/delete/${id}`);

      // Update each candidate to remove this requirement from their applied list
      const updatedCandidates = candidates.map(candidate => {
        if (candidate.applied_requirement_ids && candidate.applied_requirement_ids.includes(id.toString())) {
          return {
            ...candidate,
            applied_requirement_ids: candidate.applied_requirement_ids.filter(reqId => reqId !== id.toString())
          };
        }
        return candidate;
      });
      setCandidates(updatedCandidates);

      // Remove the deleted item from requirements state
      setRequirements(requirements.filter(req => req.id !== id));
    } catch (error) {
      console.error("Error deleting requirement:", error);
    }
  };

  const handleDeleteCandidate = async (id: number) => {
    try {
      await api.delete(`/candidates/delete/${id}`);

      // Remove the deleted item from state
      setCandidates(candidates.filter(candidate => candidate.id !== id));
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  const openEditModal = (requirement: JobRequirement) => {
    setEditingRequirement(requirement);
    setTitle(requirement.title);
    setDescription(requirement.description);
    setLocation(requirement.location || "");
    setWorkLocationType(requirement.work_location_type || "On-site");
    setExperienceRequired(requirement.experience_required || 0);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingRequirement(null);
    setEditingCandidate(null);
    // Reset requirement fields
    setTitle("");
    setDescription("");
    setLocation("");
    setWorkLocationType("On-site");
    setExperienceRequired(0);
    // Reset candidate fields
    setCandidateName("");
    setCandidateEmail("");
    setCandidatePhone("");
    setCandidateSkills("");
    setCandidateExperience("");
    setCandidateDob("");
    setCandidateAddress("");
    setCandidateEducation("");
    setCandidateResume("");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Function to get requirement title by ID
  const getRequirementTitle = (id: string) => {
    const requirement = requirements.find(req => req.id.toString() === id);
    return requirement ? requirement.title : null;
  };

  // Filter out non-existent job IDs
  const getActiveJobIds = (candidate: Candidate) => {
    if (!candidate.applied_requirement_ids || candidate.applied_requirement_ids.length === 0) {
      return [];
    }
    
    return candidate.applied_requirement_ids.filter(reqId => {
      // Only include jobs that still exist in our requirements list
      return requirements.some(req => req.id.toString() === reqId);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Main Container - 90% width */}
      <div className="w-[90%] mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Navbar with Tabs and Logout */}
        <div className="flex flex-col md:flex-row justify-between items-center p-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="flex items-center mb-2 md:mb-0">
            {/* Logo with Brand Name */}
            <div className="flex items-center mr-4">
              <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-xl font-bold">Info Origin</span>
            </div>

            <div className="flex space-x-1 md:space-x-3 ">
              <button
                className={`flex items-center px-3 py-1.5 rounded-md text-sm md:text-base transition-all ${activeTab === "requirements" ? "bg-white text-blue-700 shadow" : "hover:bg-blue-500"}`}
                onClick={() => setActiveTab("requirements")}
              >
                <FaClipboardList className="mr-1.5" />
                <span>Job Requirements</span>
              </button>
              <button
                className={`flex items-center px-3 py-1.5 rounded-md text-sm md:text-base transition-all ${activeTab === "candidates" ? "bg-white text-blue-700 shadow" : "hover:bg-blue-500"}`}
                onClick={() => setActiveTab("candidates")}
              >
                <FaUserTie className="mr-1.5" />
                <span>Candidates</span>
              </button>
            </div>

          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-md text-sm md:text-base shadow transition-all"
          >
            <FaSignOutAlt className="mr-1.5" />
            <span>Logout</span>
          </button>
        </div>


        {/* Content Area */}
        <div className="p-4">
          {activeTab === "requirements" ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-0">
                  <span className="border-b-2 border-blue-500 pb-1">Job Requirements</span>
                </h2>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow flex items-center text-sm md:text-base transition-all"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  <FaPlus className="mr-1.5" /> Add Requirement
                </button>
              </div>

              <div className="grid gap-3">
                {requirements.length > 0 ? (
                  requirements.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:shadow transition-all flex justify-between items-center"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800">{req.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {req.location}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            {req.work_location_type}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            {req.experience_required} years experience Required
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-3">
                        <button
                          onClick={() => openEditModal(req)}
                          className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteRequirement(req.id)}
                          className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="text-gray-400 mb-3">
                      <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <h3 className="text-base font-medium text-gray-500">No job requirements available</h3>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-0">
                  <span className="border-b-2 border-blue-500 pb-1">Candidates List</span>
                </h2>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow flex items-center text-sm md:text-base transition-all"
                  onClick={() => {
                    navigate("/signup?role=candidate")
                  }}
                >
                  <FaPlus className="mr-1.5" /> Add Candidate
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {candidates.length > 0 ? (
                  candidates.map((candidate) => {
                    // Get only the active job IDs (those that still exist)
                    const activeJobIds = getActiveJobIds(candidate);
                    
                    return (
                      <div
                        key={candidate.id}
                        className="bg-white border border-gray-200 p-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex flex-col space-y-1 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">{candidate.name}</h3>
                          <span className="text-sm text-blue-600">{candidate.email}</span>
                        </div>

                        <div className="text-sm text-gray-600 mb-2 space-y-1">
                          <p>{candidate.phone}</p>
                          {candidate.experience && <p>Experience: {candidate.experience}</p>} 
                          {candidate.skills && <p>Skills: {candidate.skills}</p>}
                          {candidate.dob && <p>Date of Birth: {candidate.dob}</p>}
                          {candidate.address && <p>Address: {candidate.address}</p>}
                          {candidate.education && <p>Education: {candidate.education}</p>}
                        </div>

                        {/* Display Applied Jobs - but only those that exist */}
                        {activeJobIds.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center mb-1">
                              <FaBriefcase className="mr-1 text-blue-600" size={14} /> 
                              Applied Jobs:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {activeJobIds.map((reqId, index) => {
                                const jobTitle = getRequirementTitle(reqId);
                                if (!jobTitle) return null;
                                
                                return (
                                  <span 
                                    key={index} 
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                                  >
                                    {jobTitle}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {candidate.resume && (
                          <a
                            href={candidate.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline block mt-2"
                          >
                            📄 View Resume
                          </a>
                        )}

                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() => openCandidateEditModal(candidate)}
                            className="flex items-center justify-center px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCandidate(candidate.id)}
                            className="flex items-center justify-center px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-10">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-500">No candidates available</h3>
                  </div>
                )}
              </div>

            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold mb-4">
              {activeTab === "requirements"
                ? editingRequirement ? "Edit Requirement" : "Add Requirement"
                : editingCandidate ? "Edit Candidate" : ""}
            </h3>

            <form onSubmit={activeTab === "requirements" ? handleAddOrEditRequirement : handleUpdateCandidate} className="space-y-4">
              {activeTab === "requirements" ? (
                <>
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <select
                    value={workLocationType}
                    onChange={(e) => setWorkLocationType(e.target.value as "On-site" | "Hybrid" | "Remote")}
                    className="w-full border p-2 rounded"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Experience Required (years)"
                    value={experienceRequired}
                    onChange={(e) => setExperienceRequired(Number(e.target.value))}
                    className="w-full border p-2 rounded"
                    required
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    placeholder="Skills (e.g. React, Node.js, SQL)"
                    value={candidateSkills}
                    onChange={(e) => setCandidateSkills(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                  <input
                    placeholder="Experience"
                    value={candidateExperience}
                    onChange={(e) => setCandidateExperience(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    value={candidateDob}
                    onChange={(e) => setCandidateDob(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                  <input
                    placeholder="Address"
                    value={candidateAddress}
                    onChange={(e) => setCandidateAddress(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                  <input
                    placeholder="Education"
                    value={candidateEducation}
                    onChange={(e) => setCandidateEducation(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Resume Link"
                    value={candidateResume}
                    onChange={(e) => setCandidateResume(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {editingRequirement || editingCandidate ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Requirements;