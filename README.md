# COVID in New Zealand

COVID in NZ is a simple web application that scraps COVID-19 data from across the Ministry of Healths website and compiles it into a single simple summarised source. It is currently live at [covidinnz.com](https://covidinnz.com).

# Setup

## Install

Firstly, you'll need to clone this repository.

```bash
git clone https://github.com/covidinnz/covidinnz.git
cd covidinnz
```

## Environment Variables

This app only has one env variable, `PORT`. Replace the port number (or keep as default) in `.env.example`, then rename the file to `.env`.

## Development

Assuming you already have Node.js and NPM installed, run the following commands.

```bash
npm install
npm run dev
```

## Deployment

Docker has been setup in this project, so for easy start-up just run `docker compose up -d --build`.

