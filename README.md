
#### Diffing service for the website monitoring project

This project is a work in progress built in the space of a few hours at the NYC EDGI Data Refuge event.

## Quick Start
1. `git clone git@github.com:edgi-govdata-archiving/differ.git`
2. `npm install`
3. `npm run dev`

## Usage
Right now what you can do is `POST` to `localhost:8000/diff` with a body that includes `blob1` and `blob2`. The response will include a blob of html generated from a `git diff`.
