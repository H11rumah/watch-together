import React, { useEffect, useRef, useState } from "react";
import { Item } from "../redux/slices/playerSlice";
import PlaylistItem from "./PlaylistItem";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type PlaylistItemGroupProps = {
    title: string | null;
    items: Item[];
};

const PlaylistItemGroup: React.FC<PlaylistItemGroupProps> = ({ title, items }) => {
    let socket = useSelector((state: RootState) => state.web.webSocket);
    let roomId = useSelector((state: RootState) => state.web.roomId);

    let currentItem = useSelector((state: RootState) => state.player.currentItem);

    let [isOpen, setIsOpen] = useState(false);
    let [counter, setCounter] = useState(0);

    function deletePlaylist() {
        if (window.confirm("Are you sure?")) {
            socket.send(
                JSON.stringify({
                    method: "deletePlaylist",
                    roomId: roomId,
                    playlistId: items[0].playlistId,
                })
            );
        }
    }

    function playPlaylist() {
        socket.send(
            JSON.stringify({
                method: "setVideo",
                roomId: roomId,
                url: items[0].ytUrl,
            })
        );
    }

    useEffect(() => {
        let id = items.findIndex((elem) => {
            return elem.ytUrl === currentItem;
        });

        setCounter(id === -1 ? 0 : id + 1);
    }, [currentItem]);

    return (
        <div className="item_group">
            <div className="item_group_header">
                <div className="item_group_header_controls">
                    <span className="item_group_header_controls_title bottom_divider">{title}</span>
                    <div className="item_group_header_controls_buttons">
                        <div className="player_page_button" title="Videos counter">
                            <span>
                                {counter}/{items.length}
                            </span>
                        </div>
                        <div className="player_page_button" title="Play playlist" onClick={() => playPlaylist()}>
                            <svg width="20px" height="20px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M176 480C148.6 480 128 457.6 128 432v-352c0-25.38 20.4-47.98 48.01-47.98c8.686 0 17.35 2.352 25.02 7.031l288 176C503.3 223.8 512 239.3 512 256s-8.703 32.23-22.97 40.95l-288 176C193.4 477.6 184.7 480 176 480z" />
                            </svg>
                        </div>
                        <div className="player_page_button" title="Delete playlist" onClick={() => deletePlaylist()}>
                            <svg height="24px" viewBox="0 0 512 512" width="24px" xmlns="http://www.w3.org/2000/svg">
                                <path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z" />
                            </svg>
                        </div>
                        <a href={`https://www.youtube.com/playlist?list=${items[0].playlistId}`} target="_blank">
                            <button className="player_page_button" title="Open in a new tab">
                                <svg height="22px" viewBox="0 0 24 24" width="22px" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19,14 L19,19 C19,20.1045695 18.1045695,21 17,21 L5,21 C3.8954305,21 3,20.1045695 3,19 L3,7 C3,5.8954305 3.8954305,5 5,5 L10,5 L10,7 L5,7 L5,19 L17,19 L17,14 L19,14 Z M18.9971001,6.41421356 L11.7042068,13.7071068 L10.2899933,12.2928932 L17.5828865,5 L12.9971001,5 L12.9971001,3 L20.9971001,3 L20.9971001,11 L18.9971001,11 L18.9971001,6.41421356 Z"
                                        fillRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </a>
                    </div>
                </div>
                <div
                    className={isOpen ? "item_group_header_arrow rotated" : "item_group_header_arrow"}
                    title={isOpen ? "Close playlist" : "Open playlist"}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <svg height="28px" viewBox="0 0 512 512" width="28px" xmlns="http://www.w3.org/2000/svg">
                        <path d="M98.9,184.7l1.8,2.1l136,156.5c4.6,5.3,11.5,8.6,19.2,8.6c7.7,0,14.6-3.4,19.2-8.6L411,187.1l2.3-2.6  c1.7-2.5,2.7-5.5,2.7-8.7c0-8.7-7.4-15.8-16.6-15.8v0H112.6v0c-9.2,0-16.6,7.1-16.6,15.8C96,179.1,97.1,182.2,98.9,184.7z" />
                    </svg>
                </div>
            </div>
            <div className={isOpen ? "item_group_items opened" : "item_group_items"}>
                {items.map((elem) => {
                    return <PlaylistItem {...elem} key={elem.ytUrl + elem.playlistId} />;
                })}
            </div>
        </div>
    );
};

export default PlaylistItemGroup;
