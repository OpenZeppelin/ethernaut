const Search = (props) => { 
    const { keyword, onKeywordChange } = props;

    const handleChange = (e) => { 
        onKeywordChange(e.target.value)
    }

    return (
        <div className='leaderboard-search-outer-container'>
            <div className="leaderboard-search stats-input-container">
                <input
                    type="text"
                    className="stats-input form-control"
                    placeholder="Search player address / alias"
                    value={keyword}
                    onChange={handleChange}
                />
            </div>
        </div>
    )
}

export default Search