from sqlalchemy import create_engine

ENGINE = create_engine("sqlite:///./data/database.db", echo=True)
