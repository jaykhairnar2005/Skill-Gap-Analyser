# Add these lines to your PowerShell profile to make psql easily accessible
# Location: C:\Users\[YourUsername]\Documents\WindowsPowerShell\profile.ps1

# Function to connect to PostgreSQL
function psql {
    & "C:\Program Files\PostgreSQL\18\bin\psql" @args
}

# Function to connect to skill_gap_analyzer database
function psql-app {
    & "C:\Program Files\PostgreSQL\18\bin\psql" -U postgres -d skill_gap_analyzer @args
}

# Function to backup the database
function backup-db {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    & "C:\Program Files\PostgreSQL\18\bin\pg_dump" -U postgres skill_gap_analyzer > "backup_$timestamp.sql"
    Write-Host "Database backed up to: backup_$timestamp.sql"
}

# Usage:
# psql -U postgres                           (connects to PostgreSQL)
# psql-app -c "\dt"                          (lists tables in skill_gap_analyzer)
# backup-db                                  (backs up the database)
