import { useToast } from "../utils/Toast";
import Tooltip from "../utils/Tooltip";

function LeaderTile(props) { 
    const { rank, leader, onAliasEdit, currentUser } = props;
    const { toast, Toast } = useToast()

    let { player, score, totalNumberOfLevelsCompleted, alias } = leader;


    const handleClick = () => { 
        navigator.clipboard.writeText(player);
        toast("Address copied")
    }    

    return (
        <>
            {Toast}
            <div className='leaderboard-tile'>
                <div className="leaderboard-rank">{rank}</div>
                <div className="leaderboard-player">
                    {
                        alias ?
                            <div>{alias}</div> :
                            <Tooltip content={player}>
                                <div onClick={handleClick}>{player.split("").slice(0, 18).join("")}...</div>
                            </Tooltip>
                    }
                </div>
                <div className="leaderboard-levels-solved">
                    {totalNumberOfLevelsCompleted}
                </div>
                <div className="leaderboard-score">{score.toFixed(2)}</div>
                <div onClick={onAliasEdit} className='leaderboard-alias-edit'>
                    {
                        currentUser.toLowerCase() === player.toLowerCase() && <i className="leaderboard-edit-icon fa-solid fa-pen-to-square"></i>
                    }
                </div>
            </div>
             
        </>
    )
}

export default LeaderTile;