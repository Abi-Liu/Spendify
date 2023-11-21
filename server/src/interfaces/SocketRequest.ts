import { Server } from "socket.io";
import { Request } from "express";

// Extend the Express Request interface to include 'io'
export default interface SocketRequest extends Request {
  io: Server;
}
