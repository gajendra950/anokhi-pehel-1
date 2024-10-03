import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import Button from "../../components/Dashboard/Button";
import { BASE_URL } from "../../Service/helper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const currentColor = "#03C9D7";
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user); // User data from Redux
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  const [issueText, setIssueText] = useState(""); // Capture issue input
  const [loading, setLoading] = useState(false); // Loading state for submit
  const [issues, setIssues] = useState([]); // State to store issues

  // Function to toggle form visibility
  const raiseIssue = () => {
    setShowForm(true);
  };


  // Fetch issues from the backend
const fetchIssues = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/fetchIssues`);
      console.log("Fetched Issues:", response.data); // Log the fetched issues
      setIssues(response.data); // Set the issues from the backend
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };
  

  // Fetch issues on component mount
  useEffect(() => {
    fetchIssues();
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    

    if (!issueText.trim()) {
      alert("Please enter an issue description.");
      return;
    }
    setLoading(true); // Start loading
    try {
      const response = await axios.post(`${BASE_URL}/issues`, {
        userId: user._id, // Sending user ID or other info
        userName: user.name,
        userRegNumber: user.regnumber,
        issue: issueText,
      });
      alert("Issue submitted successfully!");
      setIssueText(""); // Clear the form
      setShowForm(false); // Hide the form after submit
      fetchIssues(); // Refresh issues after submitting a new one
    } catch (error) {
      alert("Error submitting the issue. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <DashboardLayout>
      <div className="m-2 ml-10 mr-10 mt-10  p-2 md:p-10 bg-white rounded-3xl">
        {user ? (
          <h1 className="font-bold text-center">
            Welcome On Issue Portal, {user.name}!
          </h1>
        ) : (
          <p>No user data available.</p>
        )}
        <p className="text-center mt-2">
          We're glad to have you here! If you encounter any issues or have
          suggestions for improving the Anoki Pehel web portal, please feel free
          to raise them here. Your feedback will help our web team gain valuable
          insights to make the portal more efficient and user-friendly. Thank
          you for your support!
        </p>
      </div>

      {/* Raise Issue Button */}
      <div className="flex justify-center items-start h-full sm:flex-row mt-8">
        <div className="bg-blue-200 rounded-lg p-4">
          <Button
            color="black"
            bgColor={currentColor}
            text="Raise Issue"
            borderRadius="8px"
            width="100px"
            height="40px"
            custumFunc={raiseIssue}
          />
        </div>
      </div>

      {/* Conditionally render the form */}
      {showForm && (
        <div className="flex justify-center items-start h-full sm:flex-row mt-8">
          <div className="bg-white rounded-lg p-4 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Submit Your Issue</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Describe your issue here..."
                value={issueText}
                onChange={(e) => setIssueText(e.target.value)}
                rows="5"
                required
              ></textarea>
              <div className="flex justify-end mt-4">
                <Button
                  color="white"
                  bgColor={currentColor}
                  text={loading ? "Submitting..." : "Submit"}
                  borderRadius="8px"
                  width="100px"
                  height="40px"
                  custumFunc={handleSubmit}
                  disabled={loading}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table to display issues */}
      <div className="mt-10 mx-10">
        <h2 className="text-xl font-bold mb-4">Submitted Issues</h2>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Issue</th>
              <th className="py-3 px-6 text-left">Raised By</th>
              <th className="py-3 px-6 text-left">Reg Number</th>
              <th className="py-3 px-6 text-left">Date Raised</th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
  {Array.isArray(issues) && issues.length > 0 ? (
    issues.map((issue) => (
      <tr key={issue._id} className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 text-left">
          {issue.issue.length > 10 ? (
            <>
              {issue.issue.substring(0, 10)}...{" "}
              <button
                className="text-blue-500 underline"
                onClick={() => alert(issue.issue)} // Change this to your read more function or link
              >
                Read more
              </button>
            </>
          ) : (
            issue.issue
          )}
        </td>
        <td className="py-3 px-6 text-left">{issue.userName}</td>
        <td className="py-3 px-6 text-left">{issue.userRegNumber}</td>
        <td className="py-3 px-6 text-left">{new Date(issue.createdAt).toLocaleDateString()}</td>
        <td className="py-3 px-6 text-left">{issue.status}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="py-3 px-6 text-center text-gray-500">
        No issues have been raised yet.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
