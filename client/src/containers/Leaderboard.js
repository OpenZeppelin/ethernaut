import "../styles/leaderboard.css";
import LeaderList from "../components/leaderboard/LeaderList";
import Headers from "../components/leaderboard/Headers";
import { useEffect, useState, useCallback } from "react";
import ReactPaginate from 'react-paginate';
import Search from "../components/leaderboard/Search";
import { getNetworkNamefromId } from "../utils/ethutil";
import networkDetails from "client/leaderboard/utils/networkDetails.json";
import Footer from "../components/common/Footer";
import axios from "axios";

const playersPerPage = 20;

let aliases = {}

const fetchAliases = async () => {
    try {
        const response = await axios.get('https://raw.githubusercontent.com/OpenZeppelin/ethernaut/leaderboard-periodic-update/client/leaderboard/boards/aliases.json')
        aliases = response.data
    } catch (err) { 
        console.log("Failed to fetch aliases")
    }
}   

fetchAliases()

function Leaderboard() { 
    const [offset, setOffset] = useState(0);
    const [playersWithRank, setPlayersWithRank] = useState([])
    const [searchResult, setSearchResult] = useState([])
    const [searchKeyword, setSearchKeyword] = useState('')
    const [currentNetworkName, setCurrentNetworkName] = useState('')

    const pageCount = Math.ceil(searchResult.length / playersPerPage);
    const endOffset = offset + playersPerPage;
    const currentItems = searchResult.slice(offset, endOffset);

    const handleNetworkChange = useCallback(async (networkId) => { 
        if (!networkId) { 
            return;
        }
        const networkName = getNetworkNamefromId(Number(networkId))
        setCurrentNetworkName(networkName)
    }, [])

    const initateCurrentlySelectedChain = useCallback(async () => { 
        const networkId = await window.ethereum.request({ method: 'eth_chainId' })
        handleNetworkChange(networkId)
    }, [handleNetworkChange])

    // During the initial render
    useEffect(() => { 
        initateCurrentlySelectedChain()
    }, [initateCurrentlySelectedChain])

    useEffect(() => {
        window.ethereum.on('networkChanged', handleNetworkChange)
        return () => { 
            window.ethereum.removeListener('networkChanged', handleNetworkChange)
        }
    }, [handleNetworkChange])

    const fetchAndUpdate = useCallback(async () => { 
        try {
            if (!currentNetworkName) {
                return;
            }
            const leaderboardNetworkName = getLeaderboardNetworkNameFromNetworkName(currentNetworkName)
            const response = await axios.get(`https://raw.githubusercontent.com/OpenZeppelin/ethernaut/leaderboard-periodic-update/client/leaderboard/boards/networkleaderboards/${leaderboardNetworkName}LeaderBoard.json`)
            const result = response.data
            const playersWithRank = result.map(assignRank).filter(isScoreNonZero).map(assignAlias)
            setPlayersWithRank(playersWithRank)
            setSearchResult(playersWithRank)
        } catch (err) { 
            console.log("Failed to fetch leaderboard")
        }
    }, [currentNetworkName])

    // When network changes
    useEffect(() => { 
        fetchAndUpdate()
    }, [fetchAndUpdate])

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
        setOffset(0)
    }

    return (
        <main className="boxes">
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
                    <div className='leaderboard-outer-container'>
                        <ReactPaginate
                            onPageChange={handlePageClick}
                            pageCount={pageCount}
                            {...reactPaginateProps}
                        />
                    </div>
                </div>
            <Footer />
        </main>
    )
}

const reactPaginateProps = {
    pageRangeDisplayed: 5,
    renderOnZeroPageCount:null,
    breakLabel:"...",
    nextLabel: <i className="fa-sharp fa-solid fa-arrow-right"></i>,
    previousLabel: <i className="fa-sharp fa-solid fa-arrow-left"></i>,
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

const assignAlias = (player) => {
    const alias = aliases[player.player.toLowerCase()]
    if(!alias) return player
    return {
        ...player,
        alias:alias
    }
}

const isScoreNonZero = (player) => { 
    return player.score !== 0
}

export default Leaderboard;