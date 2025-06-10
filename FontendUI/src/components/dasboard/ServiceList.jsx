import { AppContext } from "../../context/AppContext";

const ServiceList = ({ services }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Service List</h2>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Service Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Description
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Price
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {services.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                {item.description}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                giá từ <span className="text-red-500">{item.price}</span> vnd
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.duration}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceList;
