import { Supply } from "./Supply";

export interface Dispenser {
    code: string;
    name: string;
    colors: string[];
    imageURL: string;
    supplies: Supply[];
    category: string;
  }
  
  