import { tavily } from "@tavily/core";
import { config } from "../config/config.js";
console.log('Tavily API Key:', config.tavily.apiKey);
const tvly = tavily({ apiKey: config.tavily.apiKey as string });

export async function tavilySearch(query :string){
  try{
    const response = await tvly.search(query);
    console.log(response);
  }
  catch(e){
    console.log("Error in tavily api : " , e)
  }
}