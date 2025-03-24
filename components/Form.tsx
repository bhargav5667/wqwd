"use client";
import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const Form = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

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

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-4 border rounded-lg shadow-md"
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
  );
};

export default Form;
