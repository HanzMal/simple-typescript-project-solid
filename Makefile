# Variabel
NODE = node
MAIN_JS = dist/index.js
MAIN_TS = src/index.ts
DB_FILE = task_manager.sqlite
TSC = node_modules/.bin/tsc
TSC_BIN = $(shell pwd)/node_modules/typescript/bin/tsc


.PHONY: all build run clean db-reset

# Default action: ketik 'make' akan build dan langsung jalan
all: build

help:
	@printf "\033[1;34m📋 Available commands:\033[0m\n\n"
	@awk '/^## /{desc=substr($$0, 4)} /^[a-zA-Z]/ && desc{split($$1, a, ":"); printf "  \033[1;32m%-15s\033[0m %s\n", a[1], desc; desc=""}' $(MAKEFILE_LIST)

## Install dependencies
deps:
	@printf "\033[1;34m📦 Installing dependencies...\033[0m\n"
	@npm install

## Compile TypeScript (clean dist and compile)
build: clean
	@echo "🛠️  Compiling TypeScript..."
	@$(TSC_BIN)

## Running program
run:
	@echo "🚀 Running program..."
	@if [ -f $(MAIN_JS) ]; then \
		$(NODE) $(MAIN_JS); \
	else \
		echo "❌ Error: $(MAIN_JS) tidak ditemukan. Jalankan 'make build' dulu."; \
	fi

## clean before build
clean:
	@echo "🧹 Cleaning up dist folder..."
	rm -rf dist
	rm -rf logs

## Build and run program
start: build run

## Reset Database
db-reset:
	@printf "\033[1;34m🗑️  Deleting database file...\033[0m\n"
	@rm -f $(DB_FILE)
	@printf "\033[1;32m✓ Database reset complete\033[0m\n"