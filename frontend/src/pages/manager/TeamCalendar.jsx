import React from "react";

export default function TeamCalendar() {
  return (
    <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Team Calendar</h2>
      <p className="text-gray-600 text-sm">
        This is a placeholder for the team attendance calendar.  
        You can enhance it later with a real calendar UI.
      </p>

      <div className="mt-4 p-4 bg-gray-50 border rounded">
        <p className="text-gray-500 text-sm">
          Calendar data will appear here.  
          You can integrate a library like FullCalendar or build a custom view.
        </p>
      </div>
    </div>
  );
}