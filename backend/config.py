from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # On définit les variables attendues et leurs valeurs par défaut
    frontend_url: str = "http://localhost:3000"

    # Charge automatiquement depuis un fichier .env s'il existe
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()