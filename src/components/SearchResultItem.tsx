import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Item } from "../redux/slices/playerSlice";

type PlaylistItem = {
    snippet: {
        description: string;
        title: string;
        playlistId: string;
        resourceId: {
            videoId: string;
        };
        thumbnails: {
            default: {
                url: string;
            };
        };
    };
};

type SearchResultItemProps = {
    imgUrl: string;
    title: string;
    ytId: string;
    playlistTitle: string | null;
};

const SearchResultItem: React.FC<SearchResultItemProps> = ({ imgUrl, title, ytId, playlistTitle }) => {
    let socket = useSelector((state: RootState) => state.web.webSocket);
    let roomId = useSelector((state: RootState) => state.web.roomId);
    let apiToken = useSelector((state: RootState) => state.web.apiToken);

    let items = useSelector((state: RootState) => state.player.items);

    let isFetching = useRef(false);

    async function fetchItems(url: URL) {
        let items: PlaylistItem[] = [];

        while (true) {
            let response = await fetch(url);
            let result = await response.json();

            url.searchParams.delete("pageToken");
            url.searchParams.append("pageToken", result.nextPageToken);

            items = items.concat(result.items);

            if (!result.nextPageToken) {
                break;
            }
        }

        isFetching.current = false;

        return items;
    }

    async function clickHandler() {
        let fetchedPlaylistItems: PlaylistItem[] = [];
        let playlistItems: Item[] = [];

        if (ytId.length > 11) {
            if (items.findIndex((elem) => elem.playlistId === ytId) !== -1 || isFetching.current) return;

            isFetching.current = true;

            let url = new URL("https://youtube.googleapis.com/youtube/v3/playlistItems");

            url.searchParams.append("part", "snippet");
            url.searchParams.append("playlistId", ytId);
            url.searchParams.append("maxResults", "50");
            url.searchParams.append("key", apiToken);

            fetchedPlaylistItems = await fetchItems(url);

            fetchedPlaylistItems = fetchedPlaylistItems.filter(
                (elem: PlaylistItem) =>
                    elem.snippet.description !== "This video is unavailable." &&
                    elem.snippet.description !== "This video is private."
            );

            playlistItems = fetchedPlaylistItems.map((elem) => {
                return {
                    imgUrl: elem.snippet.thumbnails.default.url,
                    title: elem.snippet.title,
                    ytUrl: `https://www.youtube.com/watch?v=${elem.snippet.resourceId.videoId}`,
                    playlistId: elem.snippet.playlistId,
                    playlistTitle: playlistTitle,
                };
            });
        }

        if (
            (playlistItems.length &&
                items.findIndex((elem) => elem.playlistId === playlistItems[0].playlistId) === -1) ||
            items.findIndex((elem) => elem.ytUrl === `https://www.youtube.com/watch?v=${ytId}`) === -1
        ) {
            socket.send(
                JSON.stringify({
                    method: "addVideo",
                    roomId: roomId,
                    item: playlistItems.length
                        ? playlistItems
                        : {
                              imgUrl: imgUrl,
                              title: title,
                              ytUrl: `https://www.youtube.com/watch?v=${ytId}`,
                              playlistId: null,
                              playlistTitle: null,
                          },
                })
            );
        }
    }

    return (
        <div className="search_results_item" onClick={() => clickHandler()}>
            <img src={imgUrl} alt="" />
            <span>{title}</span>
        </div>
    );
};

export default SearchResultItem;
