from datetime import datetime
from pathlib import Path
import shutil

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create a timestamped backup of the SQLite database file."

    def add_arguments(self, parser):
        parser.add_argument(
            "--output-dir",
            default="backups",
            help="Directory where backup file will be created (default: backups).",
        )

    def handle(self, *args, **options):
        db_name = settings.DATABASES["default"].get("NAME")
        if not db_name:
            raise CommandError("Database NAME is not configured.")

        db_path = Path(db_name)
        if not db_path.exists():
            raise CommandError(f"Database file does not exist: {db_path}")

        output_dir = Path(options["output_dir"])
        output_dir.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"db_backup_{timestamp}.sqlite3"
        backup_path = output_dir / backup_name

        shutil.copy2(db_path, backup_path)
        self.stdout.write(self.style.SUCCESS(f"Backup created at {backup_path}"))
