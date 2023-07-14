import { useDispatch, useSelector } from "react-redux";
import "./styles/App.scss";
import { Outlet } from "react-router-dom";
import { RootState } from "./redux/store";
import { setIsConnected, setIsOwner, setRoomId, setUsername } from "./redux/slices/webSlice";
import { setCurrentItem, setIsPlay, setItems } from "./redux/slices/playerSlice";
import { useEffect } from "react";

function App() {
    let dispatch = useDispatch();

    let socket = useSelector((state: RootState) => state.web.webSocket);
    let roomId = useSelector((state: RootState) => state.web.roomId);
    let username = useSelector((state: RootState) => state.web.username);
    let isConnected = useSelector((state: RootState) => state.web.isConnected);

    socket.onopen = () => {
        dispatch(setIsConnected(true));

        socket.send(
            JSON.stringify({
                method: "connection",
            })
        );
    };

    useEffect(() => {
        let interval = setInterval(() => {
            try {
                let url = "https://watch-togerther-server.onrender.com/";
                // let url = "http://localhost:5000";

                fetch(url)
                    .then((resp) => {
                        return resp.json();
                    })
                    .then((res) => console.log(res));
            } catch {
                console.log("fail");
            }
        }, 10000);

        return () => clearInterval(interval);
    }, []);

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
        dispatch(setIsOwner(false));
        dispatch(setIsPlay(false));
        dispatch(setCurrentItem(""));
        dispatch(setItems([]));
    }

    if (!isConnected) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="App">
            <Outlet context={leaveTheRoom} />
        </div>
    );
}

export default App;
