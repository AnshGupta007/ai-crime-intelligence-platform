from datetime import date, timedelta, datetime


def date_range(start: date, end: date):
    for n in range((end - start).days + 1):
        yield start + timedelta(days=n)


def current_fiscal_year() -> int:
    today = date.today()
    return today.year if today.month >= 4 else today.year - 1


def format_timestamp(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d %H:%M:%S")
