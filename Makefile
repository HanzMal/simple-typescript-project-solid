# Variabel
TSC = ./node_modules/.bin/tsc
MAIN_JS = dist/exe.js
DB_FILE = task_manager.sqlite

.PHONY: all build run clean db-reset

# Default action: ketik 'make' akan build dan langsung jalan
all: build run

# 1. Compile TypeScript (Membersihkan dist dulu agar fresh)
build: clean
	@echo "🛠️  Compiling TypeScript..."
	$(TSC)

# 2. Menjalankan program (Sesuai review: node dist/exe.js)
run:
	@echo "🚀 Running program..."
	@if [ -f $(MAIN_JS) ]; then \
		node $(MAIN_JS); \
	else \
		echo "❌ Error: $(MAIN_JS) tidak ditemukan. Jalankan 'make build' dulu."; \
	fi

# 3. Membersihkan hasil build dan database (untuk testing dari nol)
clean:
	@echo "🧹 Cleaning up dist folder..."
	rm -rf dist

# 4. Reset Database (Sangat berguna saat development)
db-reset:
	@echo "🗑️  Deleting database file..."
	rm -f $(DB_FILE)