
const API_URL =  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type FetchOptions = RequestInit;

async function apiFetch(
  path: string,
  options: FetchOptions = {}
) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include", // 
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,         
  });

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch (e) {
      throw new Error("Something went wrong : "+e);
    }
    // console.error("API Error:", error);

    throw new Error(error|| "Request failed");  
  }

  return res;
}
export async function loginWithGoogle(googleData: any) {
  const res = await apiFetch("/api/auth/google", {
    method: "POST",
    body: JSON.stringify(googleData),
  });
  return await res.json();
}

export async function getUser() {
  const res = await apiFetch("/api/auth/me");
  return res.json();
}
export async function createJob(data: { name?: string; urls: string[] }) {
  const res = await apiFetch("/api/scrape", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return await res.json();
}


export async function getJob(jobId: string) {
  const res = await apiFetch(`/api/scrape/job/${jobId}`);
  return await res.json();
}

export async function getJobs(params?: { limit?: number; status?: string }) {
  const query = new URLSearchParams(params as any).toString();
  const res = await apiFetch(`/api/jobs?${query}`);
  return res.json();
}
export async function getStats() {
  const res = await apiFetch("/api/stats");
  return res.json();
}

export async function getLeads() {
  const res = await apiFetch(`/api/leads/allLeads`);
  return await res.json();
}
export async function getSingleLead(leadId: string) {
  try {
  const res = await fetch(`http://localhost:3001/api/leads/lead/cmkv4rwmr00091048oeqieb17`,{credentials: "include" ,headers: {'Content-Type': 'application/json' , }});
    if (res.ok) {
      console.log("Raw response from getSingleLead:", await res.json()); // Debug log to check the raw response
  return await res.json();
    }
    throw new Error("Failed to fetch single lead");
   }catch(e){
    console.log("Error fetching single lead:", e);
   }
  
}
export async function exportCSV(jobId?: string) {
  const query = jobId ? `?jobId=${jobId}` : "";

  const res = await apiFetch(`/api/export/csv${query}`);

  const contentType = res.headers.get("content-type");

  if (!contentType?.includes("text/csv")) {
    // backend ne JSON error bheja hoga
    const error = await res.json();
    throw new Error(error?.error || "Failed to export CSV");
  }

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

  export async function handleCredential(response: any) {
    const idToken = response.credential;

    const res = await fetch(`${API_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ idToken }),
    });
  if (!res.ok) {
  const err = await res.text();
  console.error("Google auth failed:", err);
  return;
}

const data = await res.json();
localStorage.setItem("user", JSON.stringify(data.user));
  }

 export async function handleViewResults(jobId:number){
   try{
    const res = await fetch(`${API_URL}/api/leads/lead/jobId/${jobId}`,{
      method:"GET",
      credentials:"include",
      headers:{"Content-type":"application/json"}
    });
    const data:resultLead[] = await res.json();
    return data;
   }catch(e){
    console.error("Error in view resluts: "+e)
    throw new Error("Error in handle view results")
   }
 }
 interface resultLead {
  leadId:string
 }
export async function getCSV(jobId: number) {
  try {
    const res = await fetch(
      `${API_URL}/api/export/csv?jobId=${jobId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to export CSV");
    }

    const blob = await res.blob(); 
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${jobId}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.log("Error in get csv", e);
  }
}
 export async function getAllCSV(queryParams: any) {
  try {
   const response = await fetch(`${API_URL}/api/export/leads?${queryParams.toString()}`, {
        method: 'GET',
        credentials:'include'
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${Date.now()}.csv}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export leads. Please try again.');
    }
  
}
 export default async function GenerateApi(){
   try{
     const res = await fetch(`${API_URL}/api/api-key/generate` , {
      method : "POST",
      headers : {"Content-type":'application/json'},
      credentials : "include"
     })
     const data =  await res.json();
     return data;
   }catch(err){
     throw new Error("Error in generate key : --- "+ err)
   }
 }
 export  async function getDetails(){
   try{
     const res = await fetch(`${API_URL}/api/api-key/get-details` , {
      method : "GET",
      headers : {"Content-type":'application/json'},
      credentials : "include"
     })
     const data =  await res.json();
     return data;
   }catch(err){
     throw new Error("Error in generate key : --- "+ err)
   }
 }
 export async function getResponce(){
  try{
    const res  = await fetch(`${API_URL}/api/api-key/scape`, {
      method :"POST",
      headers : {"Content-type": 'application/json'}
    })
  }catch(e){
    
  }
 }
 export async function reovkeApiKey(id:string){
  try{
    const res = await fetch(`${API_URL}/api/api-key/revoke/${id}` , {
      method : "PATCH",
      headers :{'Content-type': 'application/json'},
      credentials:"include"
    })
    if(!res.ok){
       throw new Error("Api key not revoked:--"+ res.text)
    }
    const data = await res.json();
    return data
  }catch(e){
    throw new Error("error in revoke api key --"+ e)
  }
}