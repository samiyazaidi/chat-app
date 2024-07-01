import { ConnectedSocket,MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
//npm install socket.io-client

@WebSocketGateway(3001,{cors:{origin:'*'}})
export class ChatGateway {
@WebSocketServer() server:Server;

handleConnection(client: Socket) {
  console.log("new user connected..", client.id);
  client.emit('you-have-connected', {
    message: "You have connected",
  });
  client.broadcast.emit('user-joined', {
    message: `New User Joined the chat: ${client.id}`,
  });
}
handleDisconnect(client:Socket){
  console.log("User disconnected", client.id);
  client.emit('you-have-connected', {
    message: "You have connected",
  });
  this.server.emit('user-left',{
    message:`User Left the chat: ${client.id}`,
    });
}
  @SubscribeMessage('events')
  handleEvent(client:Socket,message:any) {
    console.log(message);
    client.emit('reply', 'You have joined the chat');
    this.server.emit('message', {sender: client.id,
      content: message});
  }
}
