import Header from "../components/Header";
import Members from "../components/Members";
import Player from "../components/Player";
import Playlist from "../components/Playlist";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setIsConnected, setRoomId, setWebSocket } from "../redux/slices/webSlice";
import RoomLogin from "../components/RoomLogin";
import { useEffect } from "react";

const PlayerPage: React.FC = () => {
    let params = useParams();

    let socket = useSelector((state: RootState) => state.web.webSocket);
    let username = useSelector((state: RootState) => state.web.username);
    let isConnected = useSelector((state: RootState) => state.web.isConnected);

    let dispatch = useDispatch();

    dispatch(setRoomId(params.roomId));

    if (!username) {
        socket.send(
            JSON.stringify({
                method: "checkRoom",
                roomId: params.roomId,
            })
        );

        return (
            <RoomLogin
                isRoomIdNeed={false}
                isRoomIdGeneratorNeed={true}
                isPasswordNeed={true}
                isPasswordGeneratorNeed={false}
                isUsernameNeed={true}
                isUsernameGeneratorNeed={false}
                isCreateButtonNeed={false}
                isLeaveButtonNeed={true}
            />
        );
    }

    return (
        <>
            <Header />
            <div className="content">
                <Members />
                <Player />
                <Playlist />
            </div>
        </>
    );
};

export default PlayerPage;
