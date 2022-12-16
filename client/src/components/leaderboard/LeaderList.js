import LeaderTile from "./LeaderTile";

function LeaderList(props) {

    const { players } = props;

    return (
        <div>
            {players.slice(0,20).map((leader) =>
                <LeaderTile key={leader.player} rank={leader.rank} leader={leader} />
            )}
        </div>
    )
}

export default LeaderList;