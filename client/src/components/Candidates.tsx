import { useState, useEffect } from "react";
import api, { getCandidateById } from "../api/api";
import {
  FaSignOutAlt,
  FaBriefcase,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTools,
  FaFileAlt,
  FaEdit,
  FaClipboardList,
  FaUserTie,
  FaBell,
  FaCheck
} from "react-icons/fa";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  skills: string;
  dob: string;
  address: string;
  education: string;
  resume: string;
  experience: string;
}

interface JobRequirement {
  id: number;
  title: string;
  description: string;
  location: string;
  work_location_type?: string;
  experience_required?: number;
  applied: boolean;
}


const Candidates = () => {
  const [tab, setTab] = useState<"candidates" | "requirements">("candidates");
  const [jobTab, setJobTab] = useState<"new" | "applied">("new");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [requirements, setRequirements] = useState<JobRequirement[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const navigate = useNavigate();

  // Form state for editing candidate
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [candidateSkills, setCandidateSkills] = useState("");
  const [candidateExperience, setCandidateExperience] = useState("");
  const [candidateDob, setCandidateDob] = useState("");
  const [candidateAddress, setCandidateAddress] = useState("");
  const [candidateEducation, setCandidateEducation] = useState("");
  const [candidateResume, setCandidateResume] = useState("");

  useEffect(() => {
    fetchCandidates();
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      const response = await api.get("/requirements/all");
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        console.error("User ID not found.");
        setRequirements(response.data);
        return;
      }
      
      // Get the candidate's data which includes applied_requirement_ids
      const candidateResponse = await getCandidateById(userId);
      
      // Parse the applied_requirement_ids field from the candidate data
      const appliedIds = candidateResponse.applied_requirement_ids 
        ? candidateResponse.applied_requirement_ids.split(',').filter((id: string) => id !== "").map(Number)
        : [];
      
      // Mark each job as applied or not
      const requirementsWithAppliedStatus = response.data.map((job: JobRequirement) => ({
        ...job,
        applied: appliedIds.includes(job.id)
      }));
      
      setRequirements(requirementsWithAppliedStatus);
    } catch (error) {
      console.error("Error fetching job requirements:", error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const id = localStorage.getItem("userId");
      if (!id) {
        console.error("User ID not found.");
        return;
      }
      const response = await getCandidateById(id);
      setCandidates([response]);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

 const applyToJob = async (jobId: number) => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    // Make API call to store the requirement ID
    await api.post("/candidates/apply", {
      candidateId: userId,  // Send the user_id from localStorage
      requirementId: jobId
    });

    // Update UI state
    setRequirements((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, applied: true } : job
      )
    );
  } catch (error) {
    console.error("Error applying to job:", error);
  }
};

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openEditModal = (candidate: Candidate) => {
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
    setIsEditModalOpen(true);
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
        dob: candidateDob,
        address: candidateAddress,
        education: candidateEducation,
        resume: candidateResume,
      };

      await api.put(`/candidates/update/${editingCandidate.id}`, updatedCandidate);

      setCandidates(candidates.map(candidate =>
        candidate.id === editingCandidate.id
          ? { ...candidate, ...updatedCandidate }
          : candidate
      ));

      resetForm();
    } catch (error) {
      console.error("Error updating candidate:", error);
    }
  };

  const resetForm = () => {
    setIsEditModalOpen(false);
    setEditingCandidate(null);
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

  const getNewRequirements = () => {
    return requirements.filter(job => !job.applied);
  };

  const getAppliedRequirements = () => {
    return requirements.filter(job => job.applied);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
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

            <div className="flex space-x-1 md:space-x-3">
              <button
                className={`flex items-center px-3 py-1.5 rounded-md text-sm md:text-base transition-all ${tab === "candidates" ? "bg-white text-blue-700 shadow" : "hover:bg-blue-500"}`}
                onClick={() => setTab("candidates")}
              >
                <FaUserTie className="mr-1.5" />
                <span>My Profile</span>
              </button>
              <button
                className={`flex items-center px-3 py-1.5 rounded-md text-sm md:text-base transition-all ${tab === "requirements" ? "bg-white text-blue-700 shadow" : "hover:bg-blue-500"}`}
                onClick={() => setTab("requirements")}
              >
                <FaClipboardList className="mr-1.5" />
                <span>Job Requirements</span>
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

        <div className="p-4">
          {tab === "candidates" && (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-0">
                  <span className="border-b-2 border-blue-500 pb-1">My Profile</span>
                </h2>
              </div>
              <div className="space-y-6">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all"
                  >
                    <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-blue-800">{candidate.name}</h3>
                      <button
                        onClick={() => openEditModal(candidate)}
                        className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <FaEdit className="mr-1.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <InfoBlock icon={FaEnvelope} label="Email" value={candidate.email} />
                          <InfoBlock icon={FaPhone} label="Phone" value={candidate.phone} />
                          <InfoBlock icon={FaCalendarAlt} label="Date of Birth" value={candidate.dob} />
                          <InfoBlock icon={FaMapMarkerAlt} label="Address" value={candidate.address} />
                        </div>
                        <div className="space-y-3">
                          <InfoBlock icon={FaGraduationCap} label="Education" value={candidate.education} />
                          <InfoBlock icon={FaBriefcase} label="Experience" value={`${candidate.experience} years`} />
                          <InfoBlock icon={FaTools} label="Skills" value={candidate.skills} />
                          <div className="flex items-start">
                            <FaFileAlt className="text-blue-500 mt-1 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Resume</p>
                              <a
                                href={candidate.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                              >
                                View Resume
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "requirements" && (
            <>
              {/* Job Requirements Subtabs */}
              <div className="flex mb-4 border-b border-gray-200">
                <button
                  className={`flex items-center px-4 py-2 mr-2 text-sm font-medium transition-all border-b-2 ${jobTab === "new"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  onClick={() => setJobTab("new")}
                >
                  <FaBell className="mr-2" />
                  New Opportunities
                  {getNewRequirements().length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {getNewRequirements().length}
                    </span>
                  )}
                </button>
                <button
                  className={`flex items-center px-4 py-2 text-sm font-medium transition-all border-b-2 ${jobTab === "applied"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  onClick={() => setJobTab("applied")}
                >
                  <FaCheck className="mr-2" />
                  Applied Jobs
                  {getAppliedRequirements().length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {getAppliedRequirements().length}
                    </span>
                  )}
                </button>
              </div>

              {jobTab === "new" && (
                <div className="grid gap-3">
                  {getNewRequirements().length > 0 ? (
                    getNewRequirements().map((job) => (
                      <div
                        key={job.id}
                        className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow transition-all"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                            <p className="mt-2 text-sm text-gray-600">{job.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {job.location}
                              </span>
                              {job.work_location_type && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  {job.work_location_type}
                                </span>
                              )}
                              {job.experience_required && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  {job.experience_required} years experience
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => applyToJob(job.id)}
                            className="mt-3 md:mt-0 px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Apply
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
                      <h3 className="text-base font-medium text-gray-500">No new job opportunities available</h3>
                    </div>
                  )}
                </div>
              )}

              {jobTab === "applied" && (
                <div className="grid gap-3">
                  {getAppliedRequirements().length > 0 ? (
                    getAppliedRequirements().map((job) => (
                      <div
                        key={job.id}
                        className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow transition-all"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                                <FaCheck className="mr-1" /> Applied
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">{job.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {job.location}
                              </span>
                              {job.work_location_type && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  {job.work_location_type}
                                </span>
                              )}
                              {job.experience_required && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  {job.experience_required} years experience
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            className="mt-3 md:mt-0 px-4 py-2 text-sm font-semibold rounded-md bg-gray-200 text-gray-600 cursor-not-allowed"
                            disabled
                          >
                            Applied
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
                      <h3 className="text-base font-medium text-gray-500">You haven't applied to any jobs yet</h3>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Candidate Modal */}
      {isEditModalOpen && editingCandidate && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
            <form onSubmit={handleUpdateCandidate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Name" value={candidateName} onChange={setCandidateName} />
              <InputField label="Email" value={candidateEmail} onChange={setCandidateEmail} />
              <InputField label="Phone" value={candidatePhone} onChange={setCandidatePhone} />
              <InputField label="Skills" value={candidateSkills} onChange={setCandidateSkills} />
              <InputField label="Experience" value={candidateExperience} onChange={setCandidateExperience} />
              <InputField label="DOB" value={candidateDob} onChange={setCandidateDob} />
              <InputField label="Address" value={candidateAddress} onChange={setCandidateAddress} />
              <InputField label="Education" value={candidateEducation} onChange={setCandidateEducation} />
              <InputField label="Resume" value={candidateResume} onChange={setCandidateResume} />

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
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoBlock = ({ icon: Icon, label, value }: { icon: IconType; label: string; value: string }) => (
  <div className="flex items-center space-x-2">
    <Icon className="text-blue-500" />
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
  </div>
);

export default Candidates;