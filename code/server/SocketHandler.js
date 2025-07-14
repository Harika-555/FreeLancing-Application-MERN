import { Chat, Project } from "./Schema.js";
import { v4 as uuid } from 'uuid';

const SocketHandler = (socket) => {
  // ✅ Freelancer joins chat room
  socket.on("join-chat-room", async ({ projectId, freelancerId }) => {
    try {
      const project = await Project.findById(projectId);
      if (!project) return console.error(`❌ Project not found: ${projectId}`);

      if (project.freelancerId === freelancerId) {
        await socket.join(projectId);
        console.log(`✅ Freelancer joined room: ${projectId}`);

        let chats = await Chat.findById(projectId);
        if (!chats) {
          chats = new Chat({ _id: projectId, messages: [] });
          await chats.save();
        }

        socket.emit('messages-updated', { chat: chats }); // ✅ emit full chat history
      } else {
        console.warn(`⚠️ Freelancer ID mismatch for project ${projectId}`);
      }
    } catch (err) {
      console.error("❌ Error in join-chat-room:", err);
    }
  });

  // ✅ Client joins chat room
  socket.on("join-chat-room-client", async ({ projectId }) => {
    try {
      const project = await Project.findById(projectId);
      if (!project) return console.error(`❌ Project not found: ${projectId}`);

      if (["Assigned", "In Progress", "Completed"].includes(project.status)) {
        await socket.join(projectId);
        console.log(`✅ Client joined room: ${projectId}`);

        let chats = await Chat.findById(projectId);
        if (!chats) {
          chats = new Chat({ _id: projectId, messages: [] });
          await chats.save();
        }

        socket.emit('messages-updated', { chat: chats });
      }
    } catch (err) {
      console.error("❌ Error in join-chat-room-client:", err);
    }
  });

  // ✅ New message sent by client or freelancer
  socket.on('new-message', async ({ projectId, senderId, message, time }) => {
    try {
      const newMsg = { id: uuid(), text: message, senderId, time };

      await Chat.findByIdAndUpdate(
        projectId,
        { $push: { messages: newMsg } },
        { new: true, upsert: true }
      );

      const updatedChat = await Chat.findById(projectId);

      // ✅ Emit updated messages to everyone in the room
      socket.to(projectId).emit('messages-updated', { chat: updatedChat });
      socket.emit('messages-updated', { chat: updatedChat });
    } catch (err) {
      console.error("❌ Error sending new message:", err);
    }
  });

  // ✅ Force fetch messages (manually triggered if needed)
  socket.on('update-messages', async ({ projectId }) => {
    try {
      const chat = await Chat.findById(projectId);
      socket.emit('messages-updated', { chat });
    } catch (err) {
      console.error('❌ Error updating messages:', err);
    }
  });

  // ✅ Project assignment socket trigger (optional real-time update)
  socket.on('assign-project', async ({ projectId, freelancerId }) => {
    try {
      await Project.findByIdAndUpdate(projectId, {
        freelancerId,
        status: 'In Progress',
      });

      socket.to(projectId).emit('project-assigned');
      socket.emit('project-assigned');
    } catch (err) {
      console.error('❌ Socket project assign failed:', err);
    }
  });
};

export default SocketHandler;
