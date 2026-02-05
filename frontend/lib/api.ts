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
    throw new Error(error?.error || "Request failed");
  }

  return res;
}
export async function loginWithGoogle(googleData: any) {
  const res = await apiFetch("/api/auth/google", {
    method: "POST",
    body: JSON.stringify(googleData),
  });
  return res.json();
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
  return res.json();
}

export async function getJob(jobId: string) {
  const res = await apiFetch(`/api/scrape/job/${jobId}`);
  return res.json();
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
  return res.json();
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
    const data = await res.json()
    console.log(data.user)
  localStorage.setItem('user', JSON.stringify(data.user));

    if (!res.ok) {
      console.error("Google auth failed" +res);
      return;
    }
    // router.push("/dashboard");

  }