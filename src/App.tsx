import { useDispatch, useSelector } from "react-redux";
import "./styles/App.scss";
import { Outlet } from "react-router-dom";
import { RootState } from "./redux/store";
import { setIsConnected, setIsOwner, setPassword, setRoomId, setUsername, setWebSocket } from "./redux/slices/webSlice";
import { setCurrentItem, setIsPlay, setItems } from "./redux/slices/playerSlice";
import { useEffect, useRef } from "react";

function App() {
    let dispatch = useDispatch();

    let socket = useSelector((state: RootState) => state.web.webSocket);
    let roomId = useSelector((state: RootState) => state.web.roomId);
    let password = useSelector((state: RootState) => state.web.password);
    let username = useSelector((state: RootState) => state.web.username);
    let isConnected = useSelector((state: RootState) => state.web.isConnected);

    let isReconnect = useRef(false);

    socket.onopen = () => {
        dispatch(setIsConnected(true));

        socket.send(
            JSON.stringify({
                method: "connection",
            })
        );

        if (isReconnect.current) {
            isReconnect.current = false;

            socket.send(
                JSON.stringify({
                    method: "reconnect",
                    roomId: roomId,
                    password: password,
                    username: username,
                })
            );
        }
    };

    socket.onclose = () => {
        dispatch(setIsConnected(false));
        dispatch(setWebSocket(new WebSocket("wss://watch-togerther-server.onrender.com/")));

        isReconnect.current = true;
    };

    useEffect(() => {
        let interval = setInterval(() => {
            let url = "https://watch-togerther-server.onrender.com/";

            fetch(url).catch((error) => {});
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    let onBeforeUnload = () => {
        leaveTheRoom();
    };

    useEffect(() => {
        window.onbeforeunload = onBeforeUnload;

        return () => {
            window.onbeforeunload = null;
        };
    }, [username]);

    function leaveTheRoom() {
        socket.send(
            JSON.stringify({
                method: "leaveTheRoom",
                roomId: roomId,
                username: username,
            })
        );

        dispatch(setUsername(""));
        dispatch(setRoomId(""));
        dispatch(setPassword(""));
        dispatch(setIsOwner(false));
        dispatch(setIsPlay(false));
        dispatch(setCurrentItem(""));
        dispatch(setItems([]));
    }

    if (!isConnected) {
        return <h1 className="loading">Waiting for server...</h1>;
    }

    return (
        <div className="App">
            <Outlet context={leaveTheRoom} />
        </div>
    );
}

export default App;
