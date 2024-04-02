# CS3980-Final-Proj
This is the README file for the final project for CS:3980 for the Spring 2024 semester.
This project serves as a web application for tracking personal debts.


## How to Run
First, create a virtual environment with
`python -m venv venv`,
and open it with
`.\venv\Scripts\activate`.

Then install the necessary packages with
`pip install -r requirements.txt`.

Finally, start the program with
`uvicorn main:app --port 8000 --reload`.

Then just open localhost:8000 and you should see the webpage.


## main.py
This is the Python code that runs the website. It uses FastAPI for the app and Starlette for the file responses.

## debtModel.py
This is the python code that defines the structure for a debt object and a debt request.

## debtTracker.py
This is the python code that serves as the main router for the application. When an HTTP request is sent in, this is the file that handles the request and sneds out the necessary information.

## Frontend

### HTML
index.html: This is the html for the main page for this project. It has a table that get populated with the entries the user gives on addDebt.html

addDebt.html: This is the html for the form page that creates a debt object for the application.

updateDebt.html: This is the html for the form page that updates a debt object in the application.

### CSS
style.css: This is the style sheet for the HTML files. It centers the elements, adds borders to the table, and makes the buttons look nicer.

### Java Script
debts.js: This is the Javascript file that communicates between the HTML pages and the server by sending XML HTTP Requests. It is responsible for fetching and sending information to the server, as well as populating the table in the HTML page.

## Pictures
![Empty Table](/pics/pywebMt_empty.JPG)
This is what the main page looks like before any debts have been entered.
#

![Add New Debt Form](/pics/pywebMt_new.JPG)
This is the form that is filled out in order to enter a debt.
#

![Filled in Table](/pics/pywebMt_filled.JPG)

This is what the main page looks like with a few entries added.
#

![Update Debt Form](/pics/pywebMt_update.JPG)

This is the form that is filled out in order to update a debt.
