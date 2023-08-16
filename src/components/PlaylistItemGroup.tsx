import React, { useState } from "react";
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

    let [isOpen, setIsOpen] = useState(false);

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

    return (
        <div className="item_group">
            <div className="item_group_header">
                <span className="item_group_header_title">{title}</span>

                <div className="item_group_header_delete" title="Delete playlist" onClick={() => deletePlaylist()}>
                    <svg height="24px" viewBox="0 0 512 512" width="24px" xmlns="http://www.w3.org/2000/svg">
                        <path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z" />
                    </svg>
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
