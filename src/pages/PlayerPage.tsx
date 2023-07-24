import { useEffect } from "react";
import Header from "../components/Header";
import Members from "../components/Members";
import Player from "../components/Player";
import Playlist from "../components/Playlist";
import { useOutletContext, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setRoomId } from "../redux/slices/webSlice";
import RoomLogin from "../components/RoomLogin";

const PlayerPage = () => {
    let params = useParams();

    let socket = useSelector((state: RootState) => state.web.webSocket);
    let username = useSelector((state: RootState) => state.web.username);

    let leaveTheRoom: Function = useOutletContext();

    let dispatch = useDispatch();

    dispatch(setRoomId(params.roomId));

    let onBeforeUnload = () => {
        leaveTheRoom();
    };

    useEffect(() => {
        window.onbeforeunload = onBeforeUnload;

        socket.onclose = onBeforeUnload;
        socket.onerror = (event) => {
            console.log(event);
        };

        return () => {
            window.onbeforeunload = null;
        };
    }, [username]);

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
