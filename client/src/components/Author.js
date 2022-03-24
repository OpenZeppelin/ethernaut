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

    var emailElements = [];
    var websiteElements = [];

    for(var i = 0; i<emails.length; i++) {
      emailElements.push(
        <span key={emails[i]}><br/><strong><a href={`mailto:${emails[i]}`} target='_blank' rel='noopener noreferrer'>{emails[i]}</a></strong></span>
      )
    }

    for(var j = 0; j<websites.length; j++) {
      websiteElements.push(
        <span key={`${emails[j]}`}><br/><strong><a href={`mailto:${websites[j]}`} target='_blank' rel='noopener noreferrer'>{websites[j]}</a></strong></span>
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

          {!nodata && emailElements
          }

          {!nodata && websiteElements
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
