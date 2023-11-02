import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import RoomLogin from "../components/RoomLogin";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { setWebSocket } from "../redux/slices/webSlice";

const MainPage: React.FC = () => {
    let leaveTheRoom: Function = useOutletContext();

    useEffect(() => {
        leaveTheRoom();
    }, []);

    return (
        <RoomLogin
            isRoomIdNeed={true}
            isRoomIdGeneratorNeed={true}
            isPasswordNeed={true}
            isPasswordGeneratorNeed={false}
            isUsernameNeed={true}
            isUsernameGeneratorNeed={false}
            isCreateButtonNeed={true}
            isLeaveButtonNeed={false}
        />
    );
};

export default MainPage;
