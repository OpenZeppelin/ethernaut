import React from 'react'

class Author extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: undefined,
      email: undefined,
      website: undefined
    };
  }

  componentDidUpdate(nextProps, prevState) {
    const data = require(`../gamedata/authors.json`).authors;
    const authorData = data[nextProps.author];
    if(!authorData) return null;
    return {
      name: authorData.name,
      email: authorData.email,
      website: authorData.website,
      donate: authorData.donate
    };
  }

  componentDidMount() {
    this.fetchAuthorData(this.props.author);
  }

  fetchAuthorData(author) {
    const data = require(`../gamedata/authors.json`).authors;
    const authorData = data[author];
    if(!authorData) return;
    this.setState({
      name: authorData.name,
      email: authorData.email,
      website: authorData.website,
      donate: authorData.donate
    });
  }

  donate(address) {
    console.log(`address: ${address}`);
  }

  render() {
    const { name, email, website, donate } = this.state;
    const nodata = !name && !email && !website && !donate;
    return (
      <div>
        <div style={{marginTop: '20px', marginBotton: '20px'}}>

          <h4>Level author</h4>

          {nodata && 
            <span>{this.props.author}</span>
          }

          {!nodata && name &&
            <span>{name}</span>
          }

          {!nodata && email && 
              <span><br/><strong><a href={`mailto:${email}`} target='_blank' rel='noopener noreferrer'>{email}</a></strong></span>
          }

          {!nodata && website && 
            <span><br/><strong><a href={website} target='_blank' rel='noopener noreferrer'>{website}</a></strong></span>
          }

          {!nodata && donate && 
              <span><br/>Did this level teach you anything useful? Donate to the level author (on mainnet): <strong>{donate}</strong></span>
          }

        </div>
      </div>
    )
  }
}

export default Author
