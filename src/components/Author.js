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

  componentWillReceiveProps(nextProps) {
    this.fetchAuthorData(nextProps.author);
  }

  componentDidMount() {
    this.fetchAuthorData(this.props.author);
  }

  fetchAuthorData(author) {
    let data = require(`../../gamedata/authors.json`).authors;
    data = data[author];
    if(!data) return;
    this.setState({
      name: data.name,
      email: data.email,
      website: data.website
    });
  }

  render() {
    const { name, email, website } = this.state;
    const nodata = !name && !email && !website;
    return (
      <div>
        <div style={{marginTop: '20px', marginBotton: '20px'}}>

          Level author:
          <br/>

          {nodata && 
            <span>{this.props.author}</span>
          }

          {!nodata && name &&
            <span>{name}</span>
          }

          {!nodata && email && 
            <span><br/><strong>{email}</strong></span>
          }

          {!nodata && website && 
            <span><br/><strong><a href={website} target='_blank'>{website}</a></strong></span>
          }

        </div>
      </div>
    )
  }
}

export default Author
