import "../styles/leaderboard.css";
import LeaderList from "../components/leaderboard/LeaderList";
import Headers from "../components/leaderboard/Headers";
import { useState } from "react";
import playersList from "../leaderboard.json";
import ReactPaginate from 'react-paginate';
import Search from "../components/leaderboard/Search";

const playersPerPage = 20;

function Leaderboard() { 
    const [offset, setOffset] = useState(0);
    const [searchResult, setSearchResult] = useState(playersWithRank)
    const [searchKeyword, setSearchKeyword] = useState('')

    const pageCount = Math.ceil(searchResult.length / playersPerPage);
    const endOffset = offset + playersPerPage;
    const currentItems = searchResult.slice(offset, endOffset);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * playersPerPage) % searchResult.length;
        setOffset(newOffset);
    };
 
    const isKeywordMatching = (keyword) => (player) => { 
        keyword = keyword.toLowerCase()
        return (
            player.player.toLowerCase().includes(keyword) ||
            player.alias.toLowerCase().includes(keyword)
        )
    }

    const updateSearchResult = (keyword) => {
        if (keyword === "") { 
            setSearchResult(playersWithRank)
            return;
        }
        setSearchKeyword(keyword)
        const result = playersWithRank.filter(isKeywordMatching(keyword))
        setSearchResult(result)
    }

    return (
        <div className='leaderboard-body'>
            <div className="leaderboard-heading">
                <div className="leaderboard-title">Leaderboard</div>
                <Search
                    searchKeyword={searchKeyword}
                    onKeywordChange={updateSearchResult}
                />
            </div>

            <Headers />
            <div className='leaderboard-list-container'>
                <LeaderList players={currentItems} />
            </div>
            <ReactPaginate
                onPageChange={handlePageClick}
                pageCount={pageCount}
                {...reactPaginateProps}
            />
         </div>
    )
}

const reactPaginateProps = {
    pageRangeDisplayed: 5,
    renderOnZeroPageCount:null,
    breakLabel:"...",
    nextLabel: "next",
    previousLabel:"previous",
    containerClassName:"leaderboard-pagination-container",
    pageLinkClassName:"leaderboard-pagination-page-item",
    activeLinkClassName:"leaderboard-pagination-selected-page-item",
    nextLinkClassName:"leaderboard-button-link",
    previousLinkClassName:"leaderboard-button-link"
}

const assignRank = ((item, index) => { 
    return {
        ...item,
        rank:index+1
    }
}) 

let playersWithRank = playersList.map(assignRank)

export default Leaderboard;