# frozen_string_literal: true

require 'faraday'
require 'json'

module Settler
  # Client for Settler API
  class Client
    def initialize(api_key:, base_url: nil)
      @api_key = api_key || ENV['SETTLER_API_KEY']
      @base_url = base_url || 'https://api.settler.dev'
      
      raise ArgumentError, 'API key is required' if @api_key.nil?
    end

    # Reconcile transactions
    def reconcile(data)
      # Implementation will be added from private repo
      raise NotImplementedError, 'Not implemented yet'
    end
  end
end
