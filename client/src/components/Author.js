import React from 'react'
import { loadTranslations } from '../utils/translations'

class Author extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: undefined,
      emails: [],
      websites: []
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.author !== prevProps.author) {
      const data = require(`../gamedata/authors.json`).authors;
      const authorData = data[this.props.author];
      if(!authorData) return null;
      this.setState({
        name: authorData.name,
        emails: authorData.emails,
        websites: authorData.websites,
        donate: authorData.donate
      });
    }
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
      emails: authorData.emails,
      websites: authorData.websites,
      donate: authorData.donate
    });
  }

  donate(address) {
    console.log(`address: ${address}`);
  }

  render() {
    let language = localStorage.getItem('lang')
    let strings = loadTranslations(language)

    const { name, emails, websites, donate } = this.state;
    const nodata = !name && !emails.length && !websites.length && !donate;

    var elements = [];

    var totalLength = Math.max(emails.length, websites.length);

    for(var i = 0; i<totalLength; i++) {
      elements.push(
        <span key={i}>
          <br/>
          <strong>
            <a href={`mailto:${emails[i]}`} target='_blank' rel='noopener noreferrer'>{emails[i]}
            </a>
          </strong>
          <br/>
          <strong>
            <a href={websites[i]} target='_blank' rel='noopener noreferrer'>{websites[i]}
            </a>
          </strong>
          <h2> </h2>
        </span>
      )
    }

    return (
      <div>
        <div style={{marginTop: '20px', marginBotton: '20px'}}>

          <h4>{strings.levelAuthor}</h4>

          {nodata && 
            <span>{this.props.author}</span>
          }

          {!nodata && name &&
            <span>{name}</span>
          }
          <p></p>
          {!nodata && elements
          }

          {!nodata && donate && 
              <span><br/>{strings.donate} <strong>{donate}</strong></span>
          }

        </div>
      </div>
    )
  }
}

export default Author
