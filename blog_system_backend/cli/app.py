from typer import Typer

from blog_system_backend.cli import admin

app = Typer()

app.add_typer(admin.app)
