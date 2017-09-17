import Head from 'next/head'

import Button from 'react-md/lib/Buttons/Button'

const Header = (props) => {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel='stylesheet' href='/static/react-md.light_blue-yellow.min.css' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Material+Icons' />
      </Head>
    </div>
  )
}

const layoutStyle = {
  margin: '0.5em',
  padding: '0.5em',
  border: '1px solid #DDD',
  //maxWidth: '640px',
  marginRight: 'auto',
  marginLeft: 'auto',
}

const Layout = (props) => (
  <div style={layoutStyle}>
    <Header children={props.children} />

    <Head>
      <title>
        {props.title ? props.title + ' | LuckyApps' : 'LuckyApps'}
      </title>
    </Head>

    <h1>{props.title}</h1>

    {props.disableLoggedInParts ? (<span></span>) : (
      <a href='/logout' target='_self'>
        <Button raised secondary label='ログアウト' />
      </a>
    )}

    {props.children}
  </div>
)

export default Layout
