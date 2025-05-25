export interface Product {
    name: string;
    description: string;
    quantity: string;
    code: string;
    imageURL: string;
    category: string;
  }
  
  export interface ProposalItem extends Product {
    price: number;
  }