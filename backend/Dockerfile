
FROM docker.iranserver.com/python:3.14-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PIP_INDEX_URL=https://pypi.devneeds.ir/simple/
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy requirements and install
COPY requirements.txt /app/
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements-dev.txt

# Copy source code
COPY src /app/

EXPOSE 8000

# Simple CMD without waiting for database
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
