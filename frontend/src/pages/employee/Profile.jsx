import React from "react";

export default function Profile() {
  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      <div className="space-y-2 text-sm text-gray-700">
        <div><strong>Name:</strong> —</div>
        <div><strong>Email:</strong> —</div>
        <div><strong>Employee ID:</strong> —</div>
        <div><strong>Department:</strong> —</div>
      </div>
      <div className="mt-4">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Edit Profile</button>
      </div>
    </div>
  );
}