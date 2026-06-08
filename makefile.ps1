# PowerShell development functions for Todo App
# Usage: . .\dev.ps1  (to load functions)
# Then run: Build, Up, Down, Migrate, etc.

function Build {
    docker compose build
}

function Up {
    docker compose up -d
    docker compose logs -f
}

function Down {
    docker compose down
}

function Migrate {
    docker compose exec backend python manage.py makemigrations
    docker compose exec backend python manage.py migrate
}

function Superuser {
    docker compose exec backend python manage.py createsuperuser
}

function Clean {
    docker compose down -v
    docker system prune -f
}

function Logs {
    docker compose logs -f
}

function Shell {
    docker compose exec backend python manage.py shell
}

function Status {
    docker compose ps
}

function Restart {
    docker compose restart
}

function Rebuild {
    docker compose build --no-cache
    docker compose up -d
}

Write-Host "Todo App Dev Functions Loaded!" -ForegroundColor Green
Write-Host "Available commands: Build, Up, Down, Migrate, Superuser, Clean, Logs, Shell, Status, Restart, Rebuild" -ForegroundColor Cyan