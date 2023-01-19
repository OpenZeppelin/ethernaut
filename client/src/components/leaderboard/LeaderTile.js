import { getPlayerAddress } from "../../utils/ethutil";
import { useToast } from "../utils/Toast";
import Tooltip from "../utils/Tooltip";

function LeaderTile(props) { 
    const { rank, leader } = props;
    const { toast, Toast } = useToast()

    let { player, score, alias, totalNumberOfLevelsCompleted } = leader;

    if (alias) { 
        player = alias;
    }

    const handleClick = () => { 
        navigator.clipboard.writeText(player);
        toast("Address copied")
    }

    console.log(getPlayerAddress())
    
    return (
        <>
            {Toast}
            <div className='leaderboard-tile'>
                <div className="leaderboard-rank">{rank}</div>
                <div className="leaderboard-player">
                    <Tooltip content={player}>
                        <div onClick={handleClick}>{player.split("").slice(0, 18).join("")}...</div>
                    </Tooltip>
                </div>
                <div className="leaderboard-levels-solved">
                    {totalNumberOfLevelsCompleted}
                </div>
                <div className="leaderboard-score">{score.toFixed(2)}</div>
                <div className="leaderboard-edit-player">{player === '' ? "✍️" : ""}</div>
            </div>
        </>
    )
}

export default LeaderTile;