'use client'
import GenerateApi from "@/lib/api";
import { use, useEffect, useState } from "react";
interface generateKeyProps{
  message : string;
  apiKey : string;
}
export default  function ApiPage() {
  const [tab, setTab] = useState("curl");
  const [generateKeyData , setGenerateKeyData] = useState<generateKeyProps>();

  async function generateApiKey(){
    const data = await GenerateApi();
    setGenerateKeyData(data)
    }
    
  return (
    <div className="flex text-gray-200">
      {/* MAIN */}
      <div className="flex-1 p-6 space-y-6">

        {/* TOP GRID */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* API KEYS */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur rounded-2xl p-5 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">API Keys</h2>
              <button onClick={()=>generateApiKey()} className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm">
                Generate New Key
              </button>
            </div>
      
            <div className="text-sm">
              <div className="grid grid-cols-5 text-gray-400 pb-2 border-b border-white/10">
                <span>Name</span>
                <span>Key</span>
                <span>Created</span>
                <span>Last Used</span>
                <span>Actions</span>
              </div>

              <div className="grid grid-cols-5 py-3 items-center">
                <span>Default Key</span>
                <span className="truncate">{generateKeyData?.apiKey}</span>
                <span>Aug 12</span>
                <span>2h ago</span>
                <div className="space-x-2">
                  <button className="text-emerald-400">Copy</button>
                  <button className="text-yellow-400">Regen</button>
                </div>
              </div>
            </div>
          </div>

          {/* USAGE */}
          <div className="space-y-4">
            <StatCard title="Requests Today" value="768" />
            <StatCard title="Total Requests" value="4,218" />
            <StatCard title="Success Rate" value="98%" />
          </div>
        </div>

        {/* QUICK START */}
        <div className="bg-white/5 backdrop-blur rounded-2xl p-5 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Quick Start</h2>

          <div className="flex gap-4 mb-4">
            {["curl", "js", "python"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`capitalize px-3 py-1 rounded-lg ${
                  tab === t ? "bg-emerald-500 text-black" : "bg-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <pre className="bg-black/40 p-4 rounded-xl text-sm overflow-x-auto">
            {tab === "curl" && curl}
            {tab === "js" && js}
            {tab === "python" && python}
          </pre>
        </div>

        {/* ENDPOINTS + PLAYGROUND */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* PLAYGROUND */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur rounded-2xl p-5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">API Playground</h2>

            <textarea
              className="w-full h-40 bg-black/40 rounded-xl p-3 text-sm outline-none"
              defaultValue={`{
  "urls": ["https://example.com"],
  "fields": ["email","title"]
}`}
            />

            <button className="mt-4 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg">
              Send Request
            </button>
          </div>

          {/* ENDPOINT LIST */}
          <div className="bg-white/5 backdrop-blur rounded-2xl p-5 border border-white/10 space-y-3">
            <h2 className="text-lg font-semibold mb-2">Endpoints</h2>
            <Endpoint method="POST" path="/jobs" />
            <Endpoint method="GET" path="/jobs" />
            <Endpoint method="GET" path="/jobs/:id" />
            <Endpoint method="GET" path="/leads" />
          </div>

        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function StatCard({ title, value } : any) {
  return (
    <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-xl font-semibold mt-1">{value}</h3>
    </div>
  );
}

function Endpoint({ method, path }:any) {
  return (
    <div className="flex justify-between items-center bg-black/30 px-3 py-2 rounded-lg">
      <span className="text-emerald-400 text-sm">{method}</span>
      <span className="text-sm">{path}</span>
    </div>
  );
}

/* CODE SNIPPETS */

const curl = `curl -X POST https://api.scrappex.com/v1/jobs
-H "Authorization: Bearer API_KEY"
-H "Content-Type: application/json"
-d '{"urls":["https://example.com"]}'`;

const js = `await fetch("/v1/jobs", {
  method: "POST",
  headers: {
    Authorization: "Bearer API_KEY",
    "Content-Type": "application/json",
  },
});`;

const python = `requests.post("/v1/jobs",
headers={"Authorization":"Bearer API_KEY"})`;
