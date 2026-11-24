@echo off
REM Stops and removes the GrowSafe Tally Bridge scheduled task. Nothing in Tally or Supabase is deleted.
schtasks /End /TN "GrowSafe Tally Bridge" >nul 2>&1
schtasks /Delete /TN "GrowSafe Tally Bridge" /F
