interface Player {
    name: string;
    password: string;
  }

interface Room {
    roomId: number;
    roomUsers: Player[];
  }
  
  const rooms: Room[] = [];
  
  export function createRoom(player: Player): Room {
    const roomId = rooms.length + 1;
    const newRoom: Room = {
      roomId,
      roomUsers: [player],
    };
    rooms.push(newRoom);
    return newRoom;
  }
  
  export function addUserToRoom(player: Player, roomId: number): Room | undefined {
    const room = rooms.find((r) => r.roomId === roomId);
  
    if (room) {
      room.roomUsers.push(player);
      return room;
    }
  
    return undefined;
  }
  
  export function updateRoomState(): Room[] {
    return rooms.filter((room) => room.roomUsers.length === 1);
  }
  