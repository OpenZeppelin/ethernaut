import "../styles/leaderboard.css";
import LeaderList from "../components/leaderboard/LeaderList";
import Headers from "../components/leaderboard/Headers";
import { useEffect, useState, useCallback } from "react";
import ReactPaginate from 'react-paginate';
import Search from "../components/leaderboard/Search";
import { getNetworkNamefromId } from "../utils/ethutil";
import networkDetails from "client/leaderboard/utils/networkDetails.json";

const playersPerPage = 20;

function Leaderboard() { 
    const [offset, setOffset] = useState(0);
    const [playersWithRank, setPlayersWithRank] = useState([])
    const [searchResult, setSearchResult] = useState([])
    const [searchKeyword, setSearchKeyword] = useState('')
    const [currentNetwork, setCurrentNetwork] = useState('')

    const pageCount = Math.ceil(searchResult.length / playersPerPage);
    const endOffset = offset + playersPerPage;
    const currentItems = searchResult.slice(offset, endOffset);

    const handleNetworkChange = useCallback(async (networkId) => { 
        if (!networkId) { 
            return;
        }
        const networkName = getNetworkNamefromId(Number(networkId))
        setCurrentNetwork(networkName)
    }, [])

    useEffect(() => {
        handleNetworkChange(window.ethereum.chainId)
    }, [handleNetworkChange])

    useEffect(() => {
        window.ethereum.on('networkChanged', handleNetworkChange)
    }, [handleNetworkChange])

    useEffect(() => { 
        if (window.ethereum.chainId) {
            setCurrentNetwork(getNetworkNamefromId(Number(window.ethereum.chainId)))
        }
    }, [])

    useEffect(() => { 
        if (!currentNetwork) { 
            return;
        }
        debugger;
        const leaderboardNetworkName = getLeaderboardNetworkNameFromNetworkName(currentNetwork)
        const response = require(`client/leaderboard/boards/networkleaderboards/${leaderboardNetworkName}LeaderBoard.json`)
        const playersWithRank = response.map(assignRank)
        setPlayersWithRank(playersWithRank)
        setSearchResult(playersWithRank)
    }, [currentNetwork])

    const getLeaderboardNetworkNameFromNetworkName = (networkName) => {
        const targetNetwork = networkDetails.find((network) => { 
            return networkName === network.deployName
        })
        return targetNetwork.name
    }

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



export default Leaderboard;