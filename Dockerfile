FROM ruby:3.3-alpine

# Install build dependencies for Jekyll and github-pages
RUN apk add --no-cache build-base libffi-dev yaml-dev zlib-dev \
    git nodejs npm gcc g++ musl-dev make

WORKDIR /app

# Install Jekyll and dependencies
COPY Gemfile Gemfile.lock* ./

# Ensure bundler is installed and gems are properly installed
RUN gem install bundler && \
    bundle config set --local path 'vendor/bundle' && \
    bundle install --jobs 4 && \
    bundle binstubs --all && \
    rm -rf /usr/local/bundle/cache/*.gem

# Copy site content
COPY . .

# Setup permissions
RUN addgroup -g 1000 jekyll && \
    adduser -u 1000 -G jekyll -s /bin/sh -D jekyll && \
    chown -R jekyll:jekyll /app

# Set environment variables
ENV JEKYLL_ENV=development
ENV LANG=en_US.UTF-8
ENV PATH="/app/bin:${PATH}"

# Expose the default Jekyll port
EXPOSE 4000

USER jekyll

# Start Jekyll with safer options
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]