import {
  AuthorBox,
  AuthorItem,
  Description,
  Donate,
  Headline,
  Root,
} from './Author.css.js';

import React from 'react';

class Author extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: undefined,
      email: undefined,
      website: undefined,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.fetchAuthorData(nextProps.author);
  }

  componentDidMount() {
    this.fetchAuthorData(this.props.author);
  }

  fetchAuthorData(author) {
    const data = require(`../../gamedata/authors.json`).authors;
    const authorData = data[author];
    if (!authorData) return;
    this.setState({
      name: authorData.name,
      email: authorData.email,
      website: authorData.website,
      donate: authorData.donate,
    });
  }

  donate(address) {
    console.log(`address: ${address}`);
  }

  render() {
    const { name, email, website, donate } = this.state;
    const nodata = !name && !email && !website && !donate;
    return (
      <Root>
        <Headline>Level author</Headline>
        <AuthorBox>
          {nodata && <AuthorItem>{this.props.author}</AuthorItem>}
          {!nodata && name && <AuthorItem>{name}</AuthorItem>}
          {!nodata && email && (
            <AuthorItem>
              <a
                href={`mailto:${email}`}
                target="_blank"
                without="true"
                rel="noopener noreferrer"
              >
                {email}
              </a>
            </AuthorItem>
          )}
          {!nodata && website && (
            <AuthorItem>
              <a
                href={website}
                target="_blank"
                without="true"
                rel="noopener noreferrer"
              >
                {website}
              </a>
            </AuthorItem>
          )}
        </AuthorBox>

        {!nodata && donate && (
          <Description>
            Did this level teach you anything useful? Donate to the level author
            (on mainnet): <Donate>{donate}</Donate>
          </Description>
        )}
      </Root>
    );
  }
}

export default Author;
