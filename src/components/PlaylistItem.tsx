import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useParams } from "react-router-dom";

type PlaylistItemProps = {
    imgUrl: string;
    title: string;
    ytUrl: string;
};

const PlaylistItem: React.FC<PlaylistItemProps> = ({ imgUrl, title, ytUrl }) => {
    let socket = useSelector((state: RootState) => state.web.webSocket);
    let currentItem = useSelector((state: RootState) => state.player.currentItem);

    let params = useParams();

    function setVideo() {
        socket.send(
            JSON.stringify({
                method: "setVideo",
                roomId: params.roomId,
                url: ytUrl,
            })
        );
    }

    function deleteVideo() {
        socket.send(
            JSON.stringify({
                method: "deleteVideo",
                roomId: params.roomId,
                url: ytUrl,
            })
        );
    }

    return (
        <div className={ytUrl === currentItem ? "item selected" : "item"}>
            <div className="item_description">
                <img className="item_pic" src={imgUrl} />
                <span className="item_title">{title}</span>
            </div>
            <div className="item_control_buttons">
                <button className="player_page_button" title="Play video" onClick={() => setVideo()}>
                    <svg width="20px" height="20px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M176 480C148.6 480 128 457.6 128 432v-352c0-25.38 20.4-47.98 48.01-47.98c8.686 0 17.35 2.352 25.02 7.031l288 176C503.3 223.8 512 239.3 512 256s-8.703 32.23-22.97 40.95l-288 176C193.4 477.6 184.7 480 176 480z" />
                    </svg>
                </button>
                <button className="player_page_button" title="Delete video" onClick={() => deleteVideo()}>
                    <svg height="20px" viewBox="0 0 512 512" width="20px" xmlns="http://www.w3.org/2000/svg">
                        <path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z" />
                    </svg>
                </button>
                <a href={ytUrl} target="_blank">
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
    );
};

export default PlaylistItem;
