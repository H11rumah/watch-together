import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ReactPlayer from "react-player";
import { useRef, useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsPlay, setCurrentItem, setIsEnd, setItems, setIsRepeatVideo } from "../redux/slices/playerSlice";
import PlayerControl from "./PlayerControl";
import { setIsOwner, setMembers } from "../redux/slices/webSlice";

const Player: React.FC = ({}) => {
    let items = useSelector((state: RootState) => state.player.items);
    let currentItem = useSelector((state: RootState) => state.player.currentItem);
    let isPlay = useSelector((state: RootState) => state.player.isPlay);
    let isEnd = useSelector((state: RootState) => state.player.isEnd);
    let isRepeatVideo = useSelector((state: RootState) => state.player.isRepeatVideo);

    let socket = useSelector((state: RootState) => state.web.webSocket);
    let roomId = useSelector((state: RootState) => state.web.roomId);
    let isOwner = useSelector((state: RootState) => state.web.isOwner);

    let playerRef = useRef<ReactPlayer>(null);

    let isThumbMove = useRef(false);
    let isBuffer = useRef(false);

    let [seconds, setSeconds] = useState(0);
    let [volume, setVolume] = useState(0.05);

    let [isReady, setIsReady] = useState(false);

    let dispatch = useDispatch();

    let debounce = useCallback((func: Function) => {
        let timer: NodeJS.Timeout;

        return (value: number, str: string) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(value, str), 100);
        };
    }, []);

    let debouncedSetSeconds = useCallback(
        debounce((value: number, str: string) => {
            setSeconds(value);
        }),
        []
    );

    socket.onmessage = (event) => {
        let parsedMessage = JSON.parse(event.data);

        switch (parsedMessage.method) {
            case "setVideo":
                if (currentItem === parsedMessage.url) {
                    socket.send(
                        JSON.stringify({
                            method: "seekTo",
                            roomId: roomId,
                            seconds: 0,
                        })
                    );
                } else {
                    dispatch(setIsPlay(true));
                    dispatch(setIsEnd(false));

                    dispatch(setCurrentItem(parsedMessage.url));
                }
                break;

            case "play":
                dispatch(setIsPlay(true));
                break;

            case "pause":
                dispatch(setIsPlay(false));
                break;

            case "seekTo":
                seekTo(parsedMessage.seconds);
                break;

            case "synchronizePlayerItem":
                dispatch(setCurrentItem(parsedMessage.currentItem));
                break;

            case "synchronizePlayerTime":
                setTimeout(() => {
                    seekTo(parsedMessage.time);
                }, 400);

                dispatch(setIsPlay(parsedMessage.isPlay));
                break;

            case "setOwner":
                dispatch(setIsOwner(true));
                break;

            case "synchronizeItems":
                dispatch(setItems(parsedMessage.items));
                break;

            case "setIsRepeatVideo":
                dispatch(setIsRepeatVideo(parsedMessage.isRepeatVideo));
                break;

            case "synchronizeMembers":
                dispatch(setMembers(parsedMessage.members));
                break;

            case "setPlaylist":
                dispatch(setItems(parsedMessage.playlist));
                break;
        }
    };

    useEffect(() => {
        if (isReady && !isOwner) {
            socket.send(
                JSON.stringify({
                    method: "synchronizePlayerTime",
                    roomId: roomId,
                })
            );
        }
    }, [isReady, isOwner]);

    useEffect(() => {
        if (!isOwner)
            socket.send(
                JSON.stringify({
                    method: "synchronizePlayerItem",
                    roomId: roomId,
                })
            );
    }, []);

    useEffect(() => {
        let intervalSeconds: NodeJS.Timer;
        let intervalSynchronize: NodeJS.Timer;

        intervalSeconds = setInterval(() => {
            if (isPlay && !isEnd && !isThumbMove.current && !isBuffer.current && playerRef.current) {
                debouncedSetSeconds(Math.ceil(playerRef.current.getCurrentTime()), `interval`);
            }
        }, 200);

        intervalSynchronize = setInterval(() => {
            if (isOwner && playerRef.current) {
                socket.send(
                    JSON.stringify({
                        method: "saveCurrentPlayerTime",
                        roomId: roomId,
                        currentTime: playerRef.current.getCurrentTime() || 0,
                        isPlay: isPlay,
                    })
                );
            }
        }, 400);

        return () => {
            clearInterval(intervalSeconds);
            clearInterval(intervalSynchronize);
        };
    }, [isPlay, isEnd, isOwner]);

    function setVideo(link: string) {
        socket.send(
            JSON.stringify({
                method: "setVideo",
                roomId: roomId,
                link: link,
            })
        );
    }

    function seekTo(seconds: number) {
        playerRef.current?.seekTo(seconds, "seconds");
        debouncedSetSeconds(seconds + 0.001, "");

        if (playerRef.current && seconds < Math.ceil(playerRef.current.getDuration())) {
            dispatch(setIsEnd(false));
        } else {
            dispatch(setIsEnd(true));
        }
    }

    function setNextVideo() {
        let currentId = items.findIndex((elem) => elem.ytUrl === currentItem);

        if (items[currentId + 1]) {
            setVideo(items[currentId + 1].ytUrl);
        }
    }

    return (
        <div className="player block">
            <div className="player_overlay"></div>
            <ReactPlayer
                ref={playerRef}
                url={currentItem || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
                width="100%"
                height="calc(100% - 40px)"
                volume={volume}
                playing={isPlay}
                controls={false}
                playbackRate={1}
                onReady={() => {
                    playerRef.current?.seekTo(0, "seconds");

                    dispatch(setIsEnd(false));

                    setIsReady(true);
                }}
                onEnded={() => {
                    dispatch(setIsEnd(true));

                    if (isOwner) {
                        if (!isRepeatVideo) {
                            setNextVideo();
                        } else {
                            socket.send(
                                JSON.stringify({
                                    method: "seekTo",
                                    roomId: roomId,
                                    seconds: 0,
                                })
                            );
                        }
                    }
                }}
                onBuffer={() => {
                    isBuffer.current = true;
                }}
                onBufferEnd={() => {
                    isBuffer.current = false;
                }}
                config={{
                    youtube: {
                        playerVars: {
                            start: 0.01,
                            rel: 1,
                            iv_load_policy: 3,
                            disablekb: 1,
                            showinfo: 0,
                            modestbranding: 1,
                        },
                    },
                }}
            />
            <PlayerControl
                isThumbMove={isThumbMove}
                volume={volume}
                playerRef={playerRef}
                seconds={seconds}
                setSeconds={setSeconds}
                debouncedSetSeconds={debouncedSetSeconds}
                setVolume={setVolume}
            />
        </div>
    );
};

export default Player;
