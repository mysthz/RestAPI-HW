from sqlalchemy import create_engine


ENGINE = create_engine("sqlite:///./database.db", echo=True)