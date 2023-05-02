import { IoIosArrowBack } from "react-icons/io";
import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { getDocs, collection } from "firebase/firestore";
import Chat from "../components/Chat"

function Dashboard() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [users, setUsers] = useState([]);
  const [userSelect, setUserSelect] = useState("");
  

  useEffect(() => {
    const getUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => doc.data());
      setUsers(usersData);
    };
    getUsers();
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleUserClick = (user) => {
    setUserSelect(user);
    console.log(user, "user")
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`flex-shrink-0 w-64 bg-gray-800 text-white ${
          isExpanded ? "" : "hidden"
        }`}
      >
        <div className="py-4 px-2 flex justify-between items-center">
          <h1 className="text-lg font-bold">Users</h1>
          <button onClick={toggleSidebar}>
            <IoIosArrowBack className="w-6 h-6" />
          </button>
        </div>
        <ul className="py-2 px-4">
          {users?.map((user) => (
            <li
              key={user.uid}
              className="py-1 hover:bg-gray-700 cursor-pointer transition duration-300"
              onClick={() => handleUserClick(user)}
            >
              {user.email}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-200">
        <button
          onClick={toggleSidebar}
          className={`${
            isExpanded ? "hidden" : ""
          } fixed top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-md`}
        >
          <IoIosArrowBack className="w-6 h-6" />
        </button>
        <div>
          {
            userSelect ? (
                <Chat userSelect={userSelect} />
            ) : (
                <div className="flex justify-center items-center h-full">
                </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
