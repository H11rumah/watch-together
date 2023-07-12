import { useDispatch, useSelector } from "react-redux";
import "./styles/App.scss";
import { Outlet } from "react-router-dom";
import { RootState } from "./redux/store";
import { setIsConnected, setIsOwner, setRoomId, setUsername } from "./redux/slices/webSlice";
import { setCurrentItem, setIsPlay, setItems } from "./redux/slices/playerSlice";

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
