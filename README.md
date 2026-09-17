# Weather Intelligence Dashboard

A weather intelligence and planning advisory application built using Google AI Studio App Build and deployed through Cloudflare Pages.

## Live Application

https://weather-intelligence-cloudflare-2026.pages.dev/

## Data Source

The application uses public Open-Meteo APIs:

- Geocoding API: https://geocoding-api.open-meteo.com/v1/search
- Forecast API: https://api.open-meteo.com/v1/forecast

No API keys or private/customer data are used.

## Build and Deployment Flow

Google AI Studio App Build
→ GitHub
→ Cloudflare Pages
→ Live pages.dev application

## GitHub Repository

Repository:

`saritha-jaligama/weather-intelligence-cloudflare-2026`

Production branch:

`main`

## Cloudflare Pages Configuration

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

## Application Validation

The application was validated using:

- Chennai — valid city
- London — valid city
- XYZABC123 — invalid city/error handling
- Browser refresh
- Responsive browser resize

## Features

- City search and geocoding
- Current weather information
- 7-day forecast
- Temperature and precipitation visualizations
- Weather-based planning recommendations
- Invalid city error handling
- Responsive layout

## Deployment Notes

The application is deployed using Cloudflare Pages and is available through the `pages.dev` URL above.
