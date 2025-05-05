source "https://rubygems.org"

# Use the github-pages gem which includes Jekyll and all supported plugins
gem "github-pages", group: :jekyll_plugins
gem "webrick", "~> 1.9"

# Additional plugins supported by GitHub Pages
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end