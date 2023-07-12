import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ReactPlayer from "react-player";
import { useDispatch } from "react-redux";

type PlayerControlProps = {
    isThumbMove: React.MutableRefObject<boolean>;
    volume: number;
    playerRef: React.RefObject<ReactPlayer>;
    seconds: number;
    setSeconds: React.Dispatch<React.SetStateAction<number>>;
    setVolume: React.Dispatch<React.SetStateAction<number>>;
    debouncedSetSeconds: (value: number, str: string) => void;
};

const PlayerControl: React.FC<PlayerControlProps> = ({
    isThumbMove,
    volume,
    playerRef,
    seconds,
    setSeconds,
    debouncedSetSeconds,
    setVolume,
}) => {
    let socket = useSelector((state: RootState) => state.web.webSocket);
    let roomId = useSelector((state: RootState) => state.web.roomId);
    let username = useSelector((state: RootState) => state.web.username);

    let isPlay = useSelector((state: RootState) => state.player.isPlay);
    let isEnd = useSelector((state: RootState) => state.player.isEnd);
    let isRepeatVideo = useSelector((state: RootState) => state.player.isRepeatVideo);

    let currentHours = Math.floor(seconds / 3600);
    let currentMins = Math.floor(seconds / 60 - currentHours * 60);
    let currentSecs = +(seconds - currentMins * 60 - currentHours * 3600).toFixed(0);

    let duration = 0;

    let maxHours = 0;
    let maxMins = 0;
    let maxSecs = 0;

    if (playerRef.current) {
        duration = playerRef.current.getDuration();

        if (!duration) duration = 0;
        else duration = Math.ceil(duration);

        maxHours = Math.floor(duration / 3600);
        maxMins = Math.floor(duration / 60 - maxHours * 60);
        maxSecs = +(duration - maxMins * 60 - maxHours * 3600).toFixed(0);
    }

    return (
        <div className="player_control_buttons">
            <button
                className="player_page_button"
                onClick={() => {
                    if (isEnd && playerRef.current) {
                        socket.send(
                            JSON.stringify({
                                method: "seekTo",
                                roomId: roomId,
                                seconds: 0,
                            })
                        );

                        return;
                    }

                    if (isPlay) {
                        socket.send(
                            JSON.stringify({
                                method: "pause",
                                roomId: roomId,
                            })
                        );
                    } else {
                        socket.send(
                            JSON.stringify({
                                method: "play",
                                roomId: roomId,
                            })
                        );
                    }
                }}
            >
                {isEnd ? (
                    <svg height="22px" width="22px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28,16c-1.219,0-1.797,0.859-2,1.766C25.269,21.03,22.167,26,16,26c-5.523,0-10-4.478-10-10S10.477,6,16,6  c2.24,0,4.295,0.753,5.96,2H20c-1.104,0-2,0.896-2,2s0.896,2,2,2h6c1.104,0,2-0.896,2-2V4c0-1.104-0.896-2-2-2s-2,0.896-2,2v0.518  C21.733,2.932,18.977,2,16,2C8.268,2,2,8.268,2,16s6.268,14,14,14c9.979,0,14-9.5,14-11.875C30,16.672,28.938,16,28,16z" />
                    </svg>
                ) : isPlay ? (
                    <svg width="15px" height="15px" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z" />
                    </svg>
                ) : (
                    <svg width="20px" height="20px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M176 480C148.6 480 128 457.6 128 432v-352c0-25.38 20.4-47.98 48.01-47.98c8.686 0 17.35 2.352 25.02 7.031l288 176C503.3 223.8 512 239.3 512 256s-8.703 32.23-22.97 40.95l-288 176C193.4 477.6 184.7 480 176 480z" />
                    </svg>
                )}
            </button>
            <div>
                <span>
                    {currentHours > 9 ? currentHours : "0" + currentHours}:
                    {currentMins > 9 ? currentMins : "0" + currentMins}:
                    {currentSecs > 9 ? currentSecs : "0" + currentSecs}/{maxHours > 9 ? maxHours : "0" + maxHours}:
                    {maxMins > 9 ? maxMins : "0" + maxMins}:{maxSecs > 9 ? maxSecs : "0" + maxSecs}
                </span>
            </div>
            <input
                className="timeline"
                type="range"
                min="0"
                max={duration}
                value={seconds}
                step="1"
                onChange={(event) => {
                    setSeconds(+event.target.value);
                    debouncedSetSeconds(+event.target.value, "change");
                }}
                onMouseUp={(event) => {
                    let target = event.target as HTMLInputElement;

                    socket.send(
                        JSON.stringify({
                            method: "seekTo",
                            roomId: roomId,
                            seconds: +target.value,
                        })
                    );

                    isThumbMove.current = false;
                }}
                onMouseDown={() => {
                    isThumbMove.current = true;
                }}
            />
            <button
                className="player_page_button"
                title={isRepeatVideo ? "Video is looped" : "Video is not looped"}
                onClick={() => {
                    if (isRepeatVideo) {
                        socket.send(
                            JSON.stringify({
                                method: "setIsRepeatVideo",
                                roomId: roomId,
                                isRepeatVideo: false,
                            })
                        );
                    } else {
                        socket.send(
                            JSON.stringify({
                                method: "setIsRepeatVideo",
                                roomId: roomId,
                                isRepeatVideo: true,
                            })
                        );
                    }
                }}
            >
                {isRepeatVideo ? (
                    <svg width="28px" height="28px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                        <path d="m37.67675,51.06885l3.7632,3.7632a3.2,3.2 0 0 1 -4.52479,4.52479l-9.05279,-9.04959a3.2,3.2 0 0 1 0,-4.52479l9.05279,-9.05279a3.2,3.2 0 0 1 4.52479,4.52799l-3.4144,3.4112l6.77439,0a12.79998,12.79998 0 1 0 0,-25.59997a3.2,3.2 0 0 1 0,-6.39999a19.19997,19.19997 0 1 1 0,38.39995l-7.12319,0zm-11.20319,-38.39995l-3.5104,-3.5072a3.2,3.2 0 0 1 4.52799,-4.52799l9.04959,9.05279a3.2,3.2 0 0 1 0,4.52479l-9.04959,9.04959a3.2,3.2 0 0 1 -4.52799,-4.52479l3.6704,-3.6672l-7.43359,0a12.79998,12.79998 0 1 0 0,25.59997a3.2,3.2 0 0 1 0,6.39999a19.19997,19.19997 0 1 1 0,-38.39995l7.27359,0z" />
                    </svg>
                ) : (
                    <svg width="28px" height="28px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                        <path d="m2.83826,2.82551c0.99827,-0.99824 2.56038,-1.089 3.66115,-0.27226l0.31537,0.27226l54.34608,54.34585l0.27219,0.3153c0.81656,1.10074 0.72583,2.66299 -0.27219,3.66138c-0.99839,0.99801 -2.56064,1.08874 -3.66138,0.27219l-0.3153,-0.27219l-10.6977,-10.6932c-0.69958,0.12147 -1.41266,0.20433 -2.13662,0.24594l-1.09399,0.03149l-16.65293,-0.003l4.57297,4.57578c0.99835,0.99801 1.08908,2.56026 0.27226,3.661l-0.27226,0.3153c-0.99827,0.99839 -2.56038,1.08912 -3.66115,0.27219l-0.31537,-0.27219l-9.37277,-9.37277c-0.99827,-0.99801 -1.08904,-2.56026 -0.27226,-3.661l0.27226,-0.3153l9.37277,-9.37277c1.09808,-1.09811 2.87841,-1.09811 3.97653,0c0.99835,0.99801 1.08908,2.56026 0.27226,3.661l-0.27226,0.3153l-4.57297,4.56979l14.53544,0l-25.29331,-25.29608c-4.60975,1.85592 -7.92306,6.25347 -8.20443,11.45723l-0.01942,0.71998c0,4.06066 1.8446,7.69092 4.74161,10.09784c0.54808,0.508 0.89113,1.2387 0.89113,2.04926c0,1.55288 -1.25891,2.81183 -2.81183,2.81183c-0.71717,0 -1.37161,-0.26844 -1.86833,-0.71046c-4.02279,-3.42406 -6.57623,-8.53784 -6.57623,-14.24848c0,-7.04641 3.88786,-13.18475 9.63547,-16.3869l-8.79477,-8.7978l-0.27226,-0.31537c-0.81674,-1.10078 -0.72598,-2.66288 0.27226,-3.66115zm50.71866,14.20229c0.67221,0 1.28932,0.23589 1.77295,0.6294c4.07865,3.4265 6.67154,8.57522 6.67154,14.32954c0,5.69789 -2.54227,10.80193 -6.55419,14.23986l-3.9943,-3.9928c3.00228,-2.40468 4.92483,-6.1013 4.92483,-10.24706c0,-4.05158 -1.83631,-7.67427 -4.722,-10.08131c-0.56012,-0.50849 -0.91066,-1.2462 -0.91066,-2.0658c0,-1.55295 1.25895,-2.81183 2.81183,-2.81183zm-20.73406,-12.3358c0.99839,-0.99827 2.56064,-1.08904 3.66138,-0.27226l0.3153,0.27226l9.37277,9.37277l0.27219,0.31537c0.7262,0.97844 0.7352,2.32145 0.02699,3.30892l-0.29918,0.35223l-9.37277,9.37277l-0.0926,0.07806l-3.96281,-3.96281l0.07873,-0.09178l4.57016,-4.57586l-9.32043,0l-5.62741,-5.62366l14.94784,0l-4.57016,-4.56949l-0.27219,-0.31537c-0.81663,-1.10078 -0.7259,-2.66292 0.27219,-3.66115z" />
                    </svg>
                )}
            </button>
            <div className="player_page_button volume">
                <div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(event) => setVolume(+event.target.value)}
                    />
                </div>
                {volume >= 0.5 ? (
                    <svg height="28px" width="28px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M264,416.19a23.92,23.92,0,0,1-14.21-4.69l-.66-.51-91.46-75H88a24,24,0,0,1-24-24V200a24,24,0,0,1,24-24h69.65l91.46-75,.66-.51A24,24,0,0,1,288,119.83V392.17a24,24,0,0,1-24,24Z" />
                        <path d="M352,336a16,16,0,0,1-14.29-23.18c9.49-18.9,14.3-38,14.3-56.82,0-19.36-4.66-37.92-14.25-56.73a16,16,0,0,1,28.5-14.54C378.2,208.16,384,231.47,384,256c0,23.83-6,47.78-17.7,71.18A16,16,0,0,1,352,336Z" />
                        <path d="M400,384a16,16,0,0,1-13.87-24C405,327.05,416,299.45,416,256c0-44.12-10.94-71.52-29.83-103.95A16,16,0,0,1,413.83,136C434.92,172.16,448,204.88,448,256c0,50.36-13.06,83.24-34.12,120A16,16,0,0,1,400,384Z" />
                    </svg>
                ) : volume > 0 ? (
                    <svg height="28px" width="28px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <title />
                        <path d="M296,416.19a23.92,23.92,0,0,1-14.21-4.69l-.66-.51-91.46-75H120a24,24,0,0,1-24-24V200a24,24,0,0,1,24-24h69.65l91.46-75,.66-.51A24,24,0,0,1,320,119.83V392.17a24,24,0,0,1-24,24Z" />
                        <path d="M384,336a16,16,0,0,1-14.29-23.18c9.49-18.9,14.3-38,14.3-56.82,0-19.36-4.66-37.92-14.25-56.73a16,16,0,0,1,28.5-14.54C410.2,208.16,416,231.47,416,256c0,23.83-6,47.78-17.7,71.18A16,16,0,0,1,384,336Z" />
                    </svg>
                ) : (
                    <svg height="28px" width="28px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M344,416a23.92,23.92,0,0,1-14.21-4.69c-.23-.16-.44-.33-.66-.51l-91.46-74.9H168a24,24,0,0,1-24-24V200.07a24,24,0,0,1,24-24h69.65l91.46-74.9c.22-.18.43-.35.66-.51A24,24,0,0,1,368,120V392a24,24,0,0,1-24,24Z" />
                    </svg>
                )}
            </div>
        </div>
    );
};

export default PlayerControl;
