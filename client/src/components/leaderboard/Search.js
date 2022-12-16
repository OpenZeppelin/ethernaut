const Search = (props) => { 
    const { keyword, onKeywordChange } = props;

    const handleChange = (e) => { 
        onKeywordChange(e.target.value)
    }

    return (
        <div className='leaderboard-search-container'>
            <input
                value={keyword}
                onChange={handleChange}
                placeholder="search player address / alias"
                className='leaderboard-search-input'
            />
        </div>
    )
}

export default Search