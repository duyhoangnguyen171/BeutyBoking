// import React, { useContext } from "react";
import { customers } from "../../assets/data/db";
// import { AppContext } from "../../context/AppContext";

const Customers = () => {
  //   const { staffs } = useContext(AppContext);
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">Customers Management</h2>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Customers List</h2>

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                image
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Phone
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Gender
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Join Date
              </th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {item.name}
                </td>
                <td className="border border-gray-300 px-4 py-2 ">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 bg-blue-200"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.phone}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.gender}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.joinDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
