import { useSelector } from "react-redux";
import PlaylistItem from "./PlaylistItem";
import { RootState } from "../redux/store";
import { useEffect, useRef, useState } from "react";
import PlaylistItemGroup from "./PlaylistItemGroup";
import { Item } from "../redux/slices/playerSlice";

const Playlist: React.FC = () => {
    let items = useSelector((state: RootState) => state.player.items);

    let socket = useSelector((state: RootState) => state.web.webSocket);
    let roomId = useSelector((state: RootState) => state.web.roomId);

    let [playlistName, setPlaylistName] = useState("");
    let [playlistNameError, setPlaylistNameError] = useState(false);
    let [playlists, setPlaylists] = useState(JSON.parse(localStorage.getItem("playlists") || "{}"));

    let selectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        localStorage.setItem("playlists", JSON.stringify(playlists));
    }, [playlists]);

    function deletePlaylist() {
        let copy = { ...playlists };

        if (selectRef.current) {
            delete copy[selectRef.current.value];
            selectRef.current.value = "placeholder";
        }

        setPlaylists(copy);
    }

    function loadPlaylist() {
        if (selectRef.current && selectRef.current.value !== "placeholder")
            socket.send(
                JSON.stringify({
                    method: "setPlaylist",
                    roomId: roomId,
                    playlist: playlists[selectRef.current?.value],
                })
            );
    }

    function savePlaylist() {
        if (playlistName) {
            setPlaylists({
                ...playlists,
                [playlistName]: items,
            });

            setPlaylistName("");
        } else {
            setPlaylistNameError(true);
        }
    }

    function showItems() {
        let itemsArr = [];

        for (let i = 0; i < items.length; i++) {
            if (
                items[i].playlistId &&
                (!items[i - 1] || (items[i - 1] && items[i - 1]?.playlistId !== items[i].playlistId))
            ) {
                itemsArr.push(
                    <PlaylistItemGroup
                        title={items[i].playlistTitle}
                        items={items.filter((elem) => elem.playlistId === items[i].playlistId)}
                    />
                );

                // @ts-ignore
                i = items.findLastIndex((elem: Item) => elem.playlistId === items[i].playlistId);
            } else {
                itemsArr.push(<PlaylistItem {...items[i]} key={items[i].ytUrl + items[i].playlistId} />);
            }
        }

        return itemsArr;
    }

    return (
        <div className="playlist block">
            <span className="bottom_divider">Playlist</span>
            <div className="playlist_save_load bottom_divider">
                <div>
                    <select name="playlist" defaultValue={"placeholder"} ref={selectRef}>
                        <option value="placeholder" disabled>
                            Select playlist
                        </option>
                        {Object.keys(playlists).length
                            ? Object.keys(playlists).map((elem) => {
                                  return (
                                      <option value={elem} key={elem}>
                                          {elem}
                                      </option>
                                  );
                              })
                            : ""}
                    </select>
                    <button className="player_page_button" title="Delete playlist" onClick={() => deletePlaylist()}>
                        <svg height="20px" viewBox="0 0 512 512" width="20px" xmlns="http://www.w3.org/2000/svg">
                            <path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z" />
                        </svg>
                    </button>
                    <button className="player_page_button" title="Load playlist" onClick={() => loadPlaylist()}>
                        <svg width="28px" height="28px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24.972,12.288C24.608,7.657,20.723,4,16,4c-4.04,0-7.508,2.624-8.627,6.451C4.181,11.559,2,14.583,2,18  c0,4.411,3.589,8,8,8h13c3.86,0,7-3.14,7-7C30,15.851,27.93,13.148,24.972,12.288z M20.707,17.707l-4,4  C16.512,21.902,16.256,22,16,22s-0.512-0.098-0.707-0.293l-4-4c-0.286-0.286-0.372-0.716-0.217-1.09C11.231,16.244,11.596,16,12,16  h2v-4c0-1.104,0.896-2,2-2s2,0.896,2,2v4h2c0.404,0,0.769,0.244,0.924,0.617C21.079,16.991,20.993,17.421,20.707,17.707z" />
                        </svg>
                    </button>
                </div>
                <div>
                    <input
                        type="text"
                        className={playlistNameError ? "input_error" : ""}
                        value={playlistName}
                        placeholder="Playlist name"
                        onChange={(event) => {
                            setPlaylistName(event.target.value);
                            setPlaylistNameError(false);
                        }}
                    />
                    <button className="player_page_button" title="Save playlist" onClick={() => savePlaylist()}>
                        <svg width="28px" height="28px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24.972,12.288C24.608,7.657,20.723,4,16,4c-4.04,0-7.508,2.624-8.627,6.451C4.181,11.559,2,14.583,2,18  c0,4.411,3.589,8,8,8h13c3.86,0,7-3.14,7-7C30,15.851,27.93,13.148,24.972,12.288z M20.924,15.383C20.769,15.756,20.404,16,20,16h-2  v4c0,1.104-0.896,2-2,2s-2-0.896-2-2v-4h-2c-0.404,0-0.769-0.244-0.924-0.617c-0.155-0.374-0.069-0.804,0.217-1.09l4-4  C15.488,10.098,15.744,10,16,10s0.512,0.098,0.707,0.293l4,4C20.993,14.579,21.079,15.009,20.924,15.383z" />
                        </svg>
                    </button>
                </div>
            </div>
            {showItems()}
        </div>
    );
};

export default Playlist;
