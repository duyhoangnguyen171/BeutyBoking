import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { getUserById } from "../services/UserService";

const MyProfile = () => {
  const { user, token } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProfile = async () => {
    console.log("[DEBUG] Starting profile fetch...");
    console.log("[DEBUG] Current token:", token);
    console.log("[DEBUG] User ID:", user?.nameid);

    try {
      const userId = parseInt(user?.nameid || "0");
      console.log("[DEBUG] Parsed User ID:", userId);

      const { response } = await getUserById(userId);
      console.log("[DEBUG] API Response:", response);

      setUserData(response);
    } catch (error) {
      setError(error.message);
      console.error("[ERROR] Full error object:", error);
      console.error("[ERROR] Response data:", error.response?.data);
    }
  };

  useEffect(() => {
    if (token && user?.nameid && !loading) {
      setLoading(true);
      getProfile().finally(() => setLoading(false));
    }
  }, [token, user?.nameid]);

  return token ? (
    <div className="flex flex-col gap-2 text-sm">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          Error loading profile: {error}
        </div>
      )}
      <img
        className="w-36 rounded"
        src={userData.image || "https://www.w3schools.com/w3images/avatar2.png"}
        alt=""
      />
      {isEdit ? (
        <input
          type="text"
          className="bg-gray-100 text-3xl max-w-100 mt-4 rounded font-medium "
          value={user?.unique_name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className=" font-medium text-3xl mt-4 text-neutral-800">
          {userData.fullName}
        </p>
      )}
      <hr className="bg-zinc-400 h-[1px] border-none" />
      <div className=" mt-5">
        <p className="text-neutral-500 underline ">CONTACT INFORMATION</p>
        <div className="mt-2">
          <div className="flex">
            <p className="font-medium mr-4">Email:</p>
            <p className="text-blue-500"> {userData.email}</p>
          </div>
          <div className="flex">
            <p className="font-medium mr-4">Phone:</p>
            <div className="">
              {isEdit ? (
                <input
                  type="text"
                  className="border border-zinc-200"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              ) : (
                <p className=" text-teal-400 ">{userData.phone}</p>
              )}
            </div>
          </div>
          <div className="flex">
            <p className="font-medium mr-4">Address:</p>
            {isEdit ? (
              <p className="">
                <input
                  type="text"
                  className=" px-4 border border-zinc-200  "
                  value={userData.address}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </p>
            ) : (
              <p className="text-gray-500">{userData.address}</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-neutral-500 underline">BASIC INFORMATION</p>
        <div className="flex mt-2">
          <p className="font-medium">Gender :</p>
          {isEdit ? (
            <select
              value={userData.gender}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
            >
              <option className="max-w-20" value="Male">
                Male
              </option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="mx-2 text-gray-500">{userData.gender}</p>
          )}
        </div>
        <div className="flex">
          <p className="font-medium">Birthday :</p>
          {isEdit ? (
            <p className="">
              <input
                type="date"
                className=" px-4 border border-zinc-200 w-full "
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
              />
            </p>
          ) : (
            <p className="mx-2 text-gray-500">{userData.dob}</p>
          )}
        </div>
      </div>
      <div className=" my-8">
        {isEdit ? (
          <button
            onClick={() => setIsEdit(false)}
            className="bg-blue-400 px-4 py-2 rounded-2xl hover:bg-blue-600 text-white duration-300 cursor-pointer"
          >
            Save information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="bg-blue-400 px-4 py-2 rounded-2xl hover:bg-blue-600 text-white duration-300 cursor-pointer"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Please log in to view your profile
      </h1>
      <p className="text-gray-600 mb-4">
        You need to be logged in to access this page.
      </p>
      <button
        onClick={() => (window.location.href = "/login")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Go to Login
      </button>
    </div>
  );
};

export default MyProfile;
