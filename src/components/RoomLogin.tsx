import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { setIsOwner, setMembers, setRoomId, setUsername } from "../redux/slices/webSlice";
import Input from "./Input";
import { setItems } from "../redux/slices/playerSlice";

type RoomLoginProps = {
    isRoomIdNeed: boolean;
    isRoomIdGeneratorNeed: boolean;
    isPasswordNeed: boolean;
    isPasswordGeneratorNeed: boolean;
    isUsernameNeed: boolean;
    isUsernameGeneratorNeed: boolean;
    isCreateButtonNeed: boolean;
    isLeaveButtonNeed: boolean;
};

const RoomLogin: React.FC<RoomLoginProps> = ({
    isRoomIdNeed,
    isRoomIdGeneratorNeed,
    isPasswordNeed,
    isPasswordGeneratorNeed,
    isUsernameNeed,
    isUsernameGeneratorNeed,
    isCreateButtonNeed,
    isLeaveButtonNeed,
}) => {
    let socket = useSelector((state: RootState) => state.web.webSocket);
    let roomId = useSelector((state: RootState) => state.web.roomId);

    let [roomIdInput, setRoomIdInput] = useState(roomId || "");
    let [passwordInput, setPasswordInput] = useState("");
    let [usernameInput, setUsernameInput] = useState("");

    let [roomIdError, setRoomIdError] = useState("");
    let [passwordError, setPasswordError] = useState("");
    let [usernameError, setUsernameError] = useState("");

    let [isFieldsEmpty, setIsFieldsEmpty] = useState(false);

    let navigate = useNavigate();

    let dispatch = useDispatch();

    socket.onmessage = (event) => {
        let parsedMessage = JSON.parse(event.data);

        switch (parsedMessage.method) {
            case "synchronizeItems":
                dispatch(setItems(parsedMessage.items));
                break;

            case "synchronizeMembers":
                dispatch(setMembers(parsedMessage.members));
                break;

            case "redirect":
                dispatch(setUsername(usernameInput));
                dispatch(setRoomId(roomIdInput));

                navigate(`/${roomIdInput}`);
                break;

            case "error":
                socket.send(
                    JSON.stringify({
                        method: "checkRoom",
                        roomId: roomId,
                    })
                );

                switch (parsedMessage.where) {
                    case "roomId":
                        setRoomIdError(parsedMessage.text);
                        break;
                    case "password":
                        setPasswordError(parsedMessage.text);
                        break;
                    case "username":
                        setUsernameError(parsedMessage.text);
                        break;
                }
                break;

            case "checkRoom":
                if (!parsedMessage.isHaveRoom) {
                    navigate("/");
                }

                break;
        }
    };

    function checkIsFieldsEmpty() {
        if (!roomIdInput || !passwordInput || !usernameInput) {
            setIsFieldsEmpty(true);
            return true;
        }

        return false;
    }

    function enterRoom() {
        socket.send(
            JSON.stringify({
                method: "enterRoom",
                roomId: roomId || roomIdInput,
                password: passwordInput,
                username: usernameInput,
            })
        );
    }

    function createRoom() {
        socket.send(
            JSON.stringify({
                method: "createRoom",
                roomId: roomIdInput,
                password: passwordInput,
                username: usernameInput,
            })
        );

        dispatch(setIsOwner(true));
    }

    return (
        <div className="room_login">
            <h1>WatchTogether</h1>
            <div className="login block">
                <div className="login_inputs">
                    {isRoomIdNeed ? (
                        <Input
                            type="text"
                            inputState={roomIdInput}
                            setInputState={setRoomIdInput}
                            isFieldsEmpty={isFieldsEmpty}
                            setIsFieldsEmpty={setIsFieldsEmpty}
                            isNeedRandomGenerator={isRoomIdGeneratorNeed}
                            title="Room ID"
                            errorState={roomIdError}
                            setErrorState={setRoomIdError}
                            placeholder="188e1e925a9"
                        />
                    ) : (
                        ""
                    )}
                    {isPasswordNeed ? (
                        <Input
                            type="password"
                            inputState={passwordInput}
                            setInputState={setPasswordInput}
                            isFieldsEmpty={isFieldsEmpty}
                            setIsFieldsEmpty={setIsFieldsEmpty}
                            isNeedRandomGenerator={isPasswordGeneratorNeed}
                            title="Password"
                            errorState={passwordError}
                            setErrorState={setPasswordError}
                            placeholder="qwerty123"
                        />
                    ) : (
                        ""
                    )}
                    {isUsernameNeed ? (
                        <Input
                            type="text"
                            inputState={usernameInput}
                            setInputState={setUsernameInput}
                            isFieldsEmpty={isFieldsEmpty}
                            setIsFieldsEmpty={setIsFieldsEmpty}
                            isNeedRandomGenerator={isUsernameGeneratorNeed}
                            title="Username"
                            errorState={usernameError}
                            setErrorState={setUsernameError}
                            placeholder="SuperMan"
                        />
                    ) : (
                        ""
                    )}
                </div>
                <div className="login_buttons">
                    <button
                        className="main_page_button"
                        onClick={() => {
                            if (!checkIsFieldsEmpty()) enterRoom();
                        }}
                    >
                        Enter
                    </button>
                    {isCreateButtonNeed ? (
                        <button
                            className="main_page_button"
                            onClick={() => {
                                if (!checkIsFieldsEmpty()) createRoom();
                            }}
                        >
                            Create
                        </button>
                    ) : (
                        ""
                    )}
                    {isLeaveButtonNeed ? (
                        <button
                            className="main_page_button"
                            onClick={() => {
                                navigate("/");
                            }}
                        >
                            Leave
                        </button>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoomLogin;
