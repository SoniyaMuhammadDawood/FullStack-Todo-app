from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.settings import settings
import os

# =========================
# DATABASE ENGINE (ASYNC)

# Use database URL from settings
DATABASE_URL = settings.database_url

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    # Connection pool settings for Neon
    pool_size=20,          # Number of connection objects to maintain
    max_overflow=30,       # Additional connections beyond pool_size
    pool_pre_ping=True,    # Verify connections before use
    pool_recycle=300,      # Recycle connections after 5 minutes
    pool_timeout=30,       # Time to wait for a connection from the pool
)
# =========================
# ASYNC SESSION
# =========================

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
)

# =========================
# BASE MODEL
# =========================

Base = declarative_base()

# =========================
# DEPENDENCY
# =========================

async def get_async_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
