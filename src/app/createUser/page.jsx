"use client";
import { useState } from 'react';
import { setNewUser } from '@/serverComponents/dbFunctions';
import bcrypt from "bcryptjs";
import { unstable_noStore } from "next/cache";
import { useSession } from "next-auth/react";

function Page() {
  const { data: session, status } = useSession();

	// if (status === "authenticated") {
	// 	console.log("Session", session);
	// 	if(session?.user?.role !== "admin"){
	// 		return (
	// 			<div className="flex justify-center items-center h-screen">
	// 				<h1 className="text-3xl text-white">You are not authorized to view this page :)</h1>
	// 			</div>
	// 		);
	// 	}
	// }
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if(status === "authenticated")
    {
      if(session?.user?.role !== "admin"){
        window.alert("You are not allowed to access this page");
        setAllowed(true);
      }
    }


  async function handleSubmit(e) {
    e.preventDefault();
    if (username === "" || password === "") {
      window.alert("Fields are empty!");
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const res = await setNewUser({ username: username, password: hashedPassword });
      if (res?.error) throw res.error;
      window.alert("User registered.");

    } catch (error) {
      console.error("Error during login: ", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center m-4">
      <div className="flex flex-col items-center w-1/2">
        <h1 className="text-3xl font-bold mb-4 text-white">New User Creation</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center w-full"
        >
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-gray-300 rounded-md px-4 py-2 w-full mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-gray-300 rounded-md px-4 py-2 w-full mb-4"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;