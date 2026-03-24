export interface Tournament {
  id: number;
  number: string;
  name: string;
  buyIn: number;
  currency: string;
  startDate: string;
  location: string;
  maxPlayers: number;
  bracketType: string;
  guaranteedPrizepool: number;
  description: string;
}

export interface User {
  email: string;
  name: string;
  picture?: string;
}
