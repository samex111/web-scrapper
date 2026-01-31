"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';


declare global {
  interface Window {
    google: any;
  }
}

export  function Google() {
  const router = useRouter()

  const {login } = useAuth()
   useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: "",
      callback: handleCredentialResponse,
    }); 

    window.google.accounts.id.renderButton(
      document.getElementById("google-login"),
      {
        theme: "outline",
        size: "large",
      }
    );
  }, []);

  async function handleCredentialResponse(response: any) {
    const idToken = response.credential; // THIS is the token
     console.log(idToken)
    // Send token to backend
    const res = await fetch("http://localhost:3001/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();

    if (res.ok) {
      // Save backend JWT
      // localStorage.setItem("token", data.token);
      // localStorage.setItem("user", data.user);
      console.log(data)
      console.log("Logged in:", data.user);
      login(data.token , data.user)
    router.push('/dashboard');
      
    } else {
      console.error("Auth failed", data);
    }
  }

  return <div id="google-login"></div>;
}
