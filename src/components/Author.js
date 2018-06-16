import React from 'react'

class Author extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: undefined,
      email: undefined,
      github: undefined
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
      github: data.github
    });
  }

  render() {
    const { name, email, github } = this.state;
    const nodata = !name && !email && !github;
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

          {!nodata && github && 
            <span><br/><strong><a href={`https://github.com/${github}`}>github.com/{github}</a></strong></span>
          }

        </div>
      </div>
    )
  }
}

export default Author
