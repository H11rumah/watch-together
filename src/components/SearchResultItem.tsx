import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type SearchResultItemProps = {
    imgUrl: string;
    title: string;
    ytUrl: string;
};

const SearchResultItem: React.FC<SearchResultItemProps> = ({ imgUrl, title, ytUrl }) => {
    let socket = useSelector((state: RootState) => state.web.webSocket);
    let roomId = useSelector((state: RootState) => state.web.roomId);

    let items = useSelector((state: RootState) => state.player.items);

    return (
        <div
            className="search_results_item"
            onClick={() => {
                if (items.findIndex((elem) => elem.ytUrl === ytUrl) === -1)
                    socket.send(
                        JSON.stringify({
                            method: "addVideo",
                            roomId: roomId,
                            item: {
                                imgUrl: imgUrl,
                                title: title,
                                ytUrl: ytUrl,
                            },
                        })
                    );
            }}
        >
            <img src={imgUrl} alt="" />
            <span>{title}</span>
        </div>
    );
};

export default SearchResultItem;
