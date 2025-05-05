# Web Tools - Jekyll Site

A collection of utility web tools built as a Jekyll site.

## Features

- **Converter**: Convert between ASCII, HEX, Base64, Binary, and Decimal formats
- **Luhn Checker**: Validate credit card numbers using the Luhn algorithm
- **Password Generator**: Generate secure passwords with customizable options

## Running the Site

### Using Docker (recommended)

This repository includes a Docker configuration for easy development and deployment.

1. Make sure you have Docker and Docker Compose installed
2. Clone this repository
3. Run the site using Docker Compose:

```bash
docker-compose up
```

4. Visit http://localhost:4000 in your browser

### Without Docker

If you prefer to run the site without Docker:

1. Install Ruby and Jekyll (see [Jekyll Installation Guide](https://jekyllrb.com/docs/installation/))
2. Clone this repository
3. Install dependencies:

```bash
bundle install
```

4. Run the Jekyll development server:

```bash
bundle exec jekyll serve --livereload
```

5. Visit http://localhost:4000 in your browser

## Development

The site is built using Jekyll, a static site generator. Key files and directories:

- `_config.yml` - Jekyll configuration
- `_layouts/` - Site templates
- `_includes/` - Reusable components
- `_data/` - Site data files (like navigation)
- `.js` files - JavaScript for each tool's functionality

## Deployment

To build the site for production:

```bash
bundle exec jekyll build
```

The built site will be in the `_site` directory, which can be deployed to any static hosting service.