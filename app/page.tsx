"use client";
import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export default function App() {
  // State for adding data
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // State for searching data
  const [searchName, setSearchName] = useState<string>("");
  const [searchEmail, setSearchEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to save name & email to Firebase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await addDoc(collection(db, "users"), { name, email });
      alert("Data saved successfully!");
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error saving data");
    }
  };

  // Function to search for an email by name
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName) {
      alert("Please enter a name");
      return;
    }

    setLoading(true);
    setSearchEmail(null);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("name", "==", searchName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setSearchEmail(doc.data().email);
        });
      } else {
        setSearchEmail("No user found");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
      setSearchEmail("Error fetching data");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Form to save name & email */}
      <h1 className="text-2xl font-bold mb-4">Save Name & Email</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-sm w-full p-4 border rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>

      {/* Search functionality below the form */}
      <h2 className="text-xl font-bold mt-8">Find Email by Name</h2>
      <form
        onSubmit={handleSearch}
        className="max-w-sm w-full p-4 border rounded-lg shadow-md mt-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Enter Name:</label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
          Search
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-500">Searching...</p>}
      {searchEmail && <p className="mt-4 text-lg font-bold">{searchEmail}</p>}
    </div>
  );
}
