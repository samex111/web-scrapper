import  { tavily  } from "@tavily/core" ;
import { config } from "../config/config.js";

console.log('Tavily API Key:', config.tavily.apiKey);
const tvly = tavily({ apiKey: config.tavily.apiKey as string });

const response = await tvly.search("https://clutch.co/");

console.log(response);