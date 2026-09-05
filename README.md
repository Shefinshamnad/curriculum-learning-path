Curriculum Learning Path Builder

A single-page interactive Learning Path Builder built for the Junior Full-Stack Developer technical assessment.

Students can browse available learning modules and build a personalized learning path while respecting module prerequisites.

Tech Stack
HTML5
CSS3
Vanilla JavaScript (ES6+)
Bootstrap 5 via CDN
Python 3.9+
Django 4.2
Django REST Framework
django-cors-headers
SQLite
Project Structure
curriculum-learning-path/
├── backend/
│   ├── config/
│   ├── modules/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── .gitignore
└── README.md


db.sqlite3 is used locally and is excluded from Git through .gitignore.

Features
Browse all available learning modules.
View module title, description, and difficulty tier.
Add modules to a personalized learning path.
Remove modules from the selected path.
Frontend prerequisite validation.
Bootstrap alerts for invalid selections.
Backend prerequisite validation using Django REST Framework.
Invalid API requests return HTTP 400.
Valid learning paths return HTTP 200.
Modules are loaded dynamically using the native fetch() API.
Responsive layout using Bootstrap's grid system.
Prerequisite Rule

Some modules require another module to be selected first.

For example:

Web Development Basics
        ↓
Advanced JavaScript


Trying to save:

{
  "selected_ids": [3]
}


is rejected because module 3 requires module 2.

A valid request is:

{
  "selected_ids": [2, 3]
}

Backend Setup

Navigate to the backend directory:

cd ~/curriculum-learning-path/backend


Create and activate the virtual environment:

python3 -m venv venv
source venv/bin/activate


Install dependencies:

pip install -r requirements.txt


Run migrations:

python3 manage.py migrate


Start the Django server:

python3 manage.py runserver 8000


The backend will be available at:

http://127.0.0.1:8000/

API Endpoints
GET  /api/modules/
POST /api/save-path/


Full local URLs:

http://127.0.0.1:8000/api/modules/
http://127.0.0.1:8000/api/save-path/

Frontend Setup

Open a second Terminal window:

cd ~/curriculum-learning-path/frontend


Start the frontend using Python's built-in HTTP server:

python3 -m http.server 5500


Open the application:

http://127.0.0.1:5500/


Make sure the Django backend is running at the same time.

API Examples
Get Modules
curl http://127.0.0.1:8000/api/modules/

Invalid Learning Path

This request attempts to select Advanced JavaScript without its prerequisite:

curl -i -X POST http://127.0.0.1:8000/api/save-path/ \
-H "Content-Type: application/json" \
-d '{"selected_ids":[3]}'


Expected:

HTTP/1.1 400 Bad Request

Valid Learning Path

This request includes both the prerequisite and dependent module:

curl -i -X POST http://127.0.0.1:8000/api/save-path/ \
-H "Content-Type: application/json" \
-d '{"selected_ids":[2,3]}'


Expected:

HTTP/1.1 200 OK

Running Tests

From the backend directory:

cd ~/curriculum-learning-path/backend
source venv/bin/activate
python3 manage.py test


The project includes API tests covering prerequisite validation.

Git

The project uses Git with separate commits for the initial implementation and API prerequisite validation tests.

Repository

GitHub:

https://github.com/Shefinshamnad/curriculum-learning-path
