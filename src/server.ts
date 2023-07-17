import * as WebSocket from 'ws';
import { registerPlayer, findPlayer } from './players';
import { createRoom, addUserToRoom, updateRoomState } from './rooms';

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws: WebSocket) => {
  // Handle player requests here

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);

      console.log(data)

      switch (data.type) {
        case 'reg':
          const playerData = JSON.parse(data.data);
          const name = playerData.name;
          const password = playerData.password;
          const player = findPlayer(name, password);

          console.log(data);

          if (player) {
            console.log("found player")
            // Player found, send registration success response
            ws.send(
              JSON.stringify({
                type: 'reg',
                data: {
                  name: player.name,
                  index: 1, // Hardcoded for now, need to implement a proper player indexing system
                  error: false,
                  errorText: '',
                },
                id: 0,
              })
            );
          } else {
            // Player not found, create a new player and send registration success response

            console.log("Not found player")
            const registrationSuccess = registerPlayer(name, password);

            if (registrationSuccess) {
              ws.send(
                JSON.stringify({
                  type: 'reg',
                  data: JSON.stringify({
                    name: name,
                    index: 0, // Hardcoded for now, need to implement a proper player indexing system
                    error: false,
                    errorText: 'Everything is good',
                  }),
                  id: data.id,
                })
              );
            } else {
              // Registration failed, send error response
              console.log("Registration failed, send error response")
              ws.send(
                JSON.stringify({
                  type: 'reg',
                  data: {
                    name,
                    index: 0,
                    error: true,
                    errorText: 'Player name already exists',
                  },
                  id: 0,
                })
              );
            }
          }
          break;

          case 'create_room':
            if (player) {
              const room = createRoom(player);
              const responseData = {
                roomId: room.roomId,
                roomUsers: room.roomUsers.map((user) => user.name),
              };
          
              ws.send(
                JSON.stringify({
                  type: 'create_game',
                  data: responseData,
                  id: 0,
                })
              );
          
              const roomsList = updateRoomState();
              const response = {
                type: 'update_room',
                data: roomsList.map((room) => ({
                  roomId: room.roomId,
                  roomUsers: room.roomUsers.map((user) => ({ name: user.name, index: 1 })),
                })),
                id: 0,
              };
              wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify(response));
                }
              });
            }
            break;

        default:
          break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
});

console.log('WebSocket server started on port 3000');
