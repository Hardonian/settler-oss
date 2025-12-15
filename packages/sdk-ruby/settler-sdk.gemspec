Gem::Specification.new do |spec|
  spec.name          = "settler-sdk"
  spec.version       = "0.1.0"
  spec.authors       = ["Scott Hardie"]
  spec.email         = ["support@settler.dev"]

  spec.summary       = "Official Ruby SDK for Settler"
  spec.description   = "Official Ruby SDK for Settler reconciliation platform"
  spec.homepage      = "https://github.com/shardie-github/settler-oss"
  spec.license       = "MIT"

  spec.files         = Dir["lib/**/*", "README.md", "LICENSE"]
  spec.require_paths = ["lib"]

  spec.required_ruby_version = ">= 2.7.0"

  spec.add_dependency "faraday", "~> 2.0"
  spec.add_dependency "json", "~> 2.6"

  spec.add_development_dependency "rake", "~> 13.0"
  spec.add_development_dependency "rspec", "~> 3.0"
end
