export interface Supply {
    code: string;
    name: string;
    description: string;
    quantity: string;
    imageURL: string;
    imageURLsByColor: Record<string,string>; 
  }