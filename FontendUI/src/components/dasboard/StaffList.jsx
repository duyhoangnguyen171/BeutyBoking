import React from "react";

const StaffList = ({ staffs }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Staffs List</h2>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              image
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Email
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Phone
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Join Date
            </th>
          </tr>
        </thead>
        <tbody>
          {staffs?.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {item.fullName}
              </td>
              <td className="border border-gray-300 px-4 py-2 ">
                <img
                  src={item.image}
                  alt={item.fullName}
                  className="w-20 h-20 bg-blue-200"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.email}</td>
              <td className="border border-gray-300 px-4 py-2">{item.phone}</td>
              <td className="border border-gray-300 px-4 py-2">{item.role}</td>
              <td className="border border-gray-300 px-4 py-2">
                {item.joinDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffList;
