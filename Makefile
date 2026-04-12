# Configuration
TSC := npx tsc
NODE := node
MAIN_TS := src/exe.ts
MAIN_JS := dist/exe.js
DB_FILE := task_manager.sqlite

# Directories
SRC_DIR := src
DIST_DIR := dist

.PHONY: all build run clean db-reset deps start dist-clean dev help

# Default target
all: build

## Show help message
help:
	@printf "\033[1;34m📋 Available commands:\033[0m\n\n"
	@awk '/^## /{desc=substr($$0, 4)} /^[a-zA-Z]/ && desc{split($$1, a, ":"); printf "  \033[1;32m%-15s\033[0m %s\n", a[1], desc; desc=""}' $(MAKEFILE_LIST)

## Install dependencies
deps:
	@printf "\033[1;34m📦 Installing dependencies...\033[0m\n"
	@npm install

## Build TypeScript project
build:
	@printf "\033[1;34m🛠️  Compiling TypeScript...\033[0m\n"
	@$(TSC)
	@printf "\033[1;32m✓ Build complete in $(DIST_DIR)/\033[0m\n"

## Run the compiled program
run:
	@if [ ! -f "$(MAIN_JS)" ]; then \
		printf "\033[1;31m❌ Error: $(MAIN_JS) not found. Run 'make build' first.\033[0m\n"; \
		exit 1; \
	fi
	@printf "\033[1;32m🚀 Running program...\033[0m\n"
	@$(NODE) $(MAIN_JS)

## Build and run
start: build run

## Clean build artifacts
clean:
	@printf "\033[1;34m🧹 Cleaning build artifacts...\033[0m\n"
	@rm -rf $(DIST_DIR)
	@printf "\033[1;32m✓ Clean complete\033[0m\n"

## Full clean (includes database)
dist-clean: clean
	@rm -f $(DB_FILE)

## Reset database file
db-reset:
	@printf "\033[1;34m🗑️  Deleting database file...\033[0m\n"
	@rm -f $(DB_FILE)
	@printf "\033[1;32m✓ Database reset complete\033[0m\n"

## Development mode with auto-reload
dev:
	@npx concurrently "npx tsc -w" "npx nodemon $(MAIN_JS)"