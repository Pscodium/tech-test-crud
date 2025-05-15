@echo off
for /f "delims=" %%v in (.nvmrc) do (
    nvm use %%v
)