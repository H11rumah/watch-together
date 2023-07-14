import React, { useEffect, useRef, useState } from "react";
import SearchResultItem from "./SearchResultItem";
import { useNavigate } from "react-router-dom";

type ResultItem = {
    id: {
        videoId: string;
    };
    snippet: {
        thumbnails: {
            default: {
                url: string;
            };
        };
        liveBroadcastContent: string;
        title: string;
    };
};

const Header: React.FC = () => {
    let [queryText, setQueryText] = useState("");
    let [queryTextError, setQueryTextError] = useState(false);

    let [isResultsHidden, setIsResultsHidden] = useState(true);
    let [resultItems, setResultItems] = useState<ResultItem[]>([]);

    let searchResultsRef = useRef<HTMLDivElement>(null);

    let navigate = useNavigate();

    let apiToken = "AIzaSyDL-IqaQL_C_OnWHnyHeBedVzCTKqDgtms";

    let url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.append("part", "snippet");
    url.searchParams.append("maxResults", "25");
    url.searchParams.append("key", apiToken);
    url.searchParams.append("relevanceLanguage", "ru");
    url.searchParams.append("type", "video");
    url.searchParams.append("videoLicense", "any");
    url.searchParams.append("videoEmbeddable", "any");
    url.searchParams.append("videoSyndicated", "any");
    url.searchParams.append("videoType", "any");
    url.searchParams.append("videoCaption", "any");

    function search() {
        if (queryText) {
            let regex = /https?:\/\/www\.youtube\.com\/watch\?v=.{11}/;
            let matches = queryText.match(regex);

            if (matches) url.searchParams.append("q", matches[0].slice(matches[0].indexOf("=") + 1, 43));
            else url.searchParams.append("q", queryText);

            fetch(url)
                .then((response) => response.json())
                .then((result) => {
                    let items = result.items.filter((elem: ResultItem) => elem.snippet.liveBroadcastContent !== "live");

                    setResultItems(items);
                    setIsResultsHidden(false);
                });
        } else {
            setQueryTextError(true);
        }
    }

    function click(event: MouseEvent) {
        if (searchResultsRef.current && !event.composedPath().includes(searchResultsRef.current)) {
            setIsResultsHidden(true);
        }
    }

    useEffect(() => {
        document.addEventListener("click", click);

        return () => {
            document.removeEventListener("click", click);
        };
    });

    return (
        <header className="header">
            <h1>WatchTogether</h1>
            <div className="search">
                <input
                    className={queryTextError ? "input_error" : ""}
                    type="search"
                    placeholder="Rick Roll..."
                    value={queryText}
                    onChange={(event) => {
                        setQueryText(event.target.value);
                        setQueryTextError(false);
                    }}
                    onKeyDown={(event) => {
                        if (event.code === "Enter") search();
                    }}
                ></input>
                <button className="player_page_button" title="Search" onClick={() => search()}>
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M27.414,24.586l-5.077-5.077C23.386,17.928,24,16.035,24,14c0-5.514-4.486-10-10-10S4,8.486,4,14  s4.486,10,10,10c2.035,0,3.928-0.614,5.509-1.663l5.077,5.077c0.78,0.781,2.048,0.781,2.828,0  C28.195,26.633,28.195,25.367,27.414,24.586z M7,14c0-3.86,3.14-7,7-7s7,3.14,7,7s-3.14,7-7,7S7,17.86,7,14z" />
                    </svg>
                </button>
                <div className="search_results" ref={searchResultsRef} hidden={isResultsHidden}>
                    {resultItems.map((elem) => (
                        <SearchResultItem
                            imgUrl={elem.snippet.thumbnails.default.url}
                            title={elem.snippet.title}
                            ytUrl={`https://www.youtube.com/watch?v=${elem.id.videoId}`}
                        />
                    ))}
                </div>
            </div>
            <button className="player_page_button" title="Leave the room" onClick={() => navigate("/")}>
                <svg width="32" height="32" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M320,176V136a40,40,0,0,0-40-40H88a40,40,0,0,0-40,40V376a40,40,0,0,0,40,40H280a40,40,0,0,0,40-40V336"
                        className="svg"
                    />
                    <polyline points="384 176 464 256 384 336" className="svg" />
                    <line className="svg" x1="191" x2="464" y1="256" y2="256" />
                </svg>
            </button>
        </header>
    );
};

export default Header;
