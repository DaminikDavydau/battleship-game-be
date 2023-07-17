interface Player {
    name: string;
    password: string;
  }
  
  const players: Player[] = [];
  
  export function registerPlayer(name: string, password: string): boolean {
    // Check if the player with the given name already exists
    console.log(players.some((player) => player.name === name))
    if (players.some((player) => player.name === name)) {
      return false;
    }
  
    players.push({ name, password });
    console.log(players)
    return true;
  }
  
  export function findPlayer(name: string, password: string): Player | undefined {
    return players.find((player) => player.name === name && player.password === password);
  }
  