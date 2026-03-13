"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleCredential } from "@/lib/api";

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
    console.log(process.env.NEXT_PUBLIC_API_URL )
    console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
    if(!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      console.error("Google Client ID is not set");
      return;
    }

    const initGoogle = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

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
    await handleCredential(response)
    router.push("/dashboard");
  }

 return <div className="custom-google-wrapper">
  <div id="google-login"></div>
</div>

}
