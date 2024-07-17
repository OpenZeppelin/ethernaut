import "../styles/leaderboard.css";
import LeaderList from "../components/leaderboard/LeaderList";
import Headers from "../components/leaderboard/Headers";
import { useEffect, useState, useCallback } from "react";
import ReactPaginate from "react-paginate";
import Search from "../components/leaderboard/Search";
import { getNetworkNamefromId } from "../utils/ethutil";
import { NETWORKS } from "client/src/constants";
import Footer from "../components/common/Footer";
import axios from "axios";
import { ALIAS_PATH, getLeaderboardPath } from "client/src/constants";
import { Helmet } from "react-helmet";

const playersPerPage = 20;

let aliases = {};

const fetchAliases = async () => {
  try {
    const response = await axios.get(ALIAS_PATH);
    aliases = response.data;
  } catch (err) {
    console.log("Failed to fetch aliases");
  }
};

fetchAliases();

function Leaderboard() {
  const [offset, setOffset] = useState(0);
  const [playersWithRank, setPlayersWithRank] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentNetworkName, setCurrentNetworkName] = useState("");

  const pageCount = Math.ceil(searchResult.length / playersPerPage);
  const endOffset = offset + playersPerPage;
  const currentItems = searchResult.slice(offset, endOffset);

  const handleNetworkChange = useCallback(async (networkId) => {
    if (!networkId) {
      return;
    }
    const networkName = getNetworkNamefromId(Number(networkId));
    setCurrentNetworkName(networkName);
  }, []);

  const initateCurrentlySelectedChain = useCallback(async () => {
    const networkId = await window.ethereum.request({ method: "eth_chainId" });
    handleNetworkChange(networkId);
  }, [handleNetworkChange]);

  // During the initial render
  useEffect(() => {
    initateCurrentlySelectedChain();
  }, [initateCurrentlySelectedChain]);

  useEffect(() => {
    window.ethereum.on("networkChanged", handleNetworkChange);
    return () => {
      window.ethereum.removeListener("networkChanged", handleNetworkChange);
    };
  }, [handleNetworkChange]);

  const fetchAndUpdate = useCallback(async () => {
    try {
      if (!currentNetworkName) {
        return;
      }
      const leaderboardNetworkName =
        getLeaderboardNetworkNameFromNetworkName(currentNetworkName);
      const response = await axios.get(
        getLeaderboardPath(leaderboardNetworkName)
      );
      const result = response.data;
      const playersWithRank = result
        .map(assignRank)
        .filter(isScoreNonZero)
        .map(assignAlias);
      setPlayersWithRank(playersWithRank);
      setSearchResult(playersWithRank);
    } catch (err) {
      console.log("Failed to fetch leaderboard");
    }
  }, [currentNetworkName]);

  // When network changes
  useEffect(() => {
    fetchAndUpdate();
  }, [fetchAndUpdate]);

  const getLeaderboardNetworkNameFromNetworkName = (networkName) => {
    const networks = Object.entries(NETWORKS);
    const network = networks.find(
      (network) => network[1]?.name === networkName
    );
    const leaderboardNetworkName = network[0].toLowerCase().split("_")[0];
    return capitaliseFirstLetter(leaderboardNetworkName);
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * playersPerPage) % searchResult.length;
    setOffset(newOffset);
  };

  const isKeywordMatching = (keyword) => (player) => {
    keyword = keyword.toLowerCase();
    return (
      player.player.toLowerCase().includes(keyword) ||
      player.alias.toLowerCase().includes(keyword)
    );
  };

  const updateSearchResult = (keyword) => {
    if (keyword === "") {
      setSearchResult(playersWithRank);
      return;
    }
    setSearchKeyword(keyword);
    const result = playersWithRank.filter(isKeywordMatching(keyword));
    setSearchResult(result);
    setOffset(0);
  };

  return (
    <main className="main-wrapper">
      <Helmet>
        <title>The Ethernaut - Leaderboard</title>
        {/* <!-- Primary Meta Tags --> */}
        <meta name="title" content="The Ethernaut - Leaderboard" />
        <meta
          name="description"
          content="Web3/Solidity based wargame played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'. - Leaderboard"
        />
        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://ethernaut.openzeppelin.com/leaderboard"
        />
        <meta property="og:title" content="The Ethernaut - Leaderboard" />
        <meta
          property="og:description"
          content="Web3/Solidity based wargame played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'. - Leaderboard"
        />
        <meta
          property="og:image"
          content="https://ethernaut.openzeppelin.com/imgs/metatag.png"
        />
        {/* <!-- Twitter --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@OpenZeppelin" />
        <meta name="twitter:title" content="The Ethernaut - Leaderboard" />
        <meta
          name="twitter:description"
          content="Web3/Solidity based wargame played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'. - Leaderboard"
        />
        <meta
          name="twitter:image"
          content="https://ethernaut.openzeppelin.com/imgs/metatag.png"
        />
      </Helmet>
      <div className="boxes leaderboard-body">
        <div className="leaderboard-heading">
          <div className="leaderboard-title">Leaderboard</div>
          <Search
            searchKeyword={searchKeyword}
            onKeywordChange={updateSearchResult}
          />
        </div>
        <Headers />
        <div className="leaderboard-list-container">
          <LeaderList players={currentItems} />
        </div>
        <div className="leaderboard-outer-container">
          <ReactPaginate
            onPageChange={handlePageClick}
            pageCount={pageCount}
            {...reactPaginateProps}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}

const reactPaginateProps = {
  pageRangeDisplayed: 5,
  renderOnZeroPageCount: null,
  breakLabel: "...",
  nextLabel: <i className="fa-sharp fa-solid fa-arrow-right"></i>,
  previousLabel: <i className="fa-sharp fa-solid fa-arrow-left"></i>,
  containerClassName: "leaderboard-pagination-container",
  pageLinkClassName: "leaderboard-pagination-page-item",
  activeLinkClassName: "leaderboard-pagination-selected-page-item",
  nextLinkClassName: "leaderboard-button-link",
  previousLinkClassName: "leaderboard-button-link",
};

const assignRank = (item, index) => {
  return {
    ...item,
    rank: index + 1,
  };
};

const assignAlias = (player) => {
  const alias = aliases[player.player.toLowerCase()];
  if (!alias) return player;
  return {
    ...player,
    alias: alias,
  };
};

const isScoreNonZero = (player) => {
  return player.score !== 0;
};

const capitaliseFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default Leaderboard;
