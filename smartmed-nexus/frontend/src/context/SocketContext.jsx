import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineDoctors, setOnlineDoctors] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) { if (socket) { socket.disconnect(); setSocket(null); } return; }

    const newSocket = io('/', { transports: ['websocket', 'polling'] });

    newSocket.on('connect', () => {
      newSocket.emit('join', user._id);
      if (user.role === 'doctor') newSocket.emit('doctor_online', user._id);
    });

    newSocket.on('online_doctors', (doctors) => setOnlineDoctors(doctors));

    newSocket.on('disconnect', () => {});

    setSocket(newSocket);

    return () => { newSocket.disconnect(); };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineDoctors }}>
      {children}
    </SocketContext.Provider>
  );
};
