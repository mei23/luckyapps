# LuckyApps

WebApp for mastodon

Dependencies: Node, MongoDB

## Demo

https://luckyapps.herokuapp.com/

## Features

- BirdKiller
  - Monitor the local timeline of Mastodon
    and automatically mute the specified client name.
    (mainly targeted to Twitter multi-post clients)

## Setup (Local)

```sh
git clone https://github.com/luckybeastakatheboss/luckyapps.git
npm i
npm run dev
```

Note: MongoDB connection required. (`mongodb://localhost/luckyapps` is used)

## Setup (Heroku)

Heroku settings:

- mLab MongoDB
- Config Variables
    - specify session secret to `SESSION_SECRET`

See:
[Heroku Document](https://devcenter.heroku.com/articles/getting-started-with-nodejs) 

Deploy:

```sh
git push heroku master
```
