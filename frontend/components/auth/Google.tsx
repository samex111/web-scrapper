"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google: any;
  }
}

export function Google() {
  const router = useRouter();

  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        initGoogle();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    };

    const initGoogle = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login"),
        {
          theme: "outline",
          size: "large",
           width: 360  
           
        }
      );
    };

    loadGoogleScript();
  }, []);

  async function handleCredentialResponse(response: any) {
    const idToken = response.credential;

    const res = await fetch("http://localhost:3001/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ idToken }),
    });
    const data = await res.json()
    console.log(data.user)
  localStorage.setItem('user', JSON.stringify(data.user));

    if (!res.ok) {
      console.error("Google auth failed" +res);
      return;
    }
    
    router.push("/dashboard");
  }

 return <div className="custom-google-wrapper">
  <div id="google-login"></div>
</div>

}
