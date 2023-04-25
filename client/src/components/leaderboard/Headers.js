function Headers() { 
    return (
        <div className='leaderboard-tile'>
            <div className="leaderboard-rank leaderboard-header">Rank</div>
            <div className="leaderboard-player leaderboard-header">Player</div>
            <div  className="leaderboard-levels-solved leaderboard-header">Levels solved</div>
            <div className="leaderboard-score leaderboard-header">Score</div>
            <div className='leaderboard-alias-edit'></div>
        </div>
    )
}

export default Headers;