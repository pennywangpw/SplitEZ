# Introdution
This website is inspired by Splitwise. We understand your pain point - no body wants to do the math when hangs out with your friends, splitting bills can be a cumbersome process, and no one wants to spend time doing calculations.
This application would be your best partner to make it easier for you to manage your spending.

Here is the link to <a href="https://splitez.onrender.com/">SplitEZ</a>


# Technology

  <img src="https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-original.svg" title="JavaScript" alt="JavaScript" width="50" height="50"/>&nbsp;
  <img src="https://www.vectorlogo.zone/logos/python/python-icon.svg" title="Python" alt="Python" width="50" height="50"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/react/react-original-wordmark.svg" title="React" alt="React" width="50" height="50"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/redux/redux-original.svg" title="Redux" alt="Redux" width="50" height="50"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/html5/html5-plain-wordmark.svg" title="HTML" alt="HTML" width="50" height="50"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/css3/css3-plain-wordmark.svg" title="CSS" alt="CSS" width="50" height="50"/>&nbsp;
  <img src="https://www.vectorlogo.zone/logos/postgresql/postgresql-vertical.svg" title="PostgreSQL" alt="PostgreSQL" width="50" height="50"/>&nbsp;
  <img src="https://www.vectorlogo.zone/logos/sqlite/sqlite-ar21.svg" title="SQLite" alt="SQLite" width="50" height="50"/>&nbsp;

# Splash Page

![image](https://github.com/pennywangpw/SplitEZ/assets/114206215/49601d66-3a82-497e-b1b4-a6f87e34e574)




# Getting started

1. Clone this repository:

    * ` https://github.com/pennywangpw/SplitEZ.git`

    OR

    * `git@github.com:pennywangpw/SplitEZ.git`

   
2. Install dependencies:

   * `pipenv install -r requirements.txt`

3. Create a **.env** file using the **.envexample** provided 

4. Make sure the SQLite3 database connection URL is in the .env file

5. This starter organizes all tables inside the flask_schema schema, defined by the SCHEMA environment variable. Replace the value for SCHEMA with a unique name, making sure you use the snake_case convention

6. Start the app frontend using:
   *  Get into react-app directory
   * `npm start`

7. Start the app backend using:
   
    Get into your pipenv, migrate your database, seed your database, and run your Flask app
    *  `pipenv shell`
    *  `flask db upgrade`
        you may need to run this command if there's any issue: pipenv run flask seed undo 
    *  `flask seed all`
    *  `flask run`
   
9. Now you can use the Demo User or Create an account

