# INTERNAL TESTING
### Installation
  - Ensure you have the latest version of npm and NodeJS LTS version (8.11.1) or higher.
  - Also make sure MongoDB is installed.
  - Download or clone a git repository: 
    ```
    https://github.com/shpp-alyabihova/internal-testing.git
    ```
  - Import collection from assert folder:
      ```
       mongoimport --db DB_NAME --collection weather --file parsed_weather.json
      ```
      ```
       mongoimport --db DB_NAME --collection school --file parsed_school.json
      ```
  - Configure `config.json` file from `config` folder
  - From the project folder, execute the following command to install project dependencies:
    ```
    npm install
    ```
  - For run test start the `index_test.js`:
    ```
    node index_test.js
    ```
    The script returns the object with names of tasks and its results.

  - For execution task #2 separately in mongo console run script `quert2.js` from `scripts` folder.
    ```
    mongo DB_NAME query2.js
    ```
    Before executing the script - make sure that the collection is initialized with the source `parsed_weather.json` file.
  - For execution task #3 separately in mongo console run script `quert3.js` from `scripts` folder.
    ```
    mongo DB_NAME query3.js
    ```
    Before executing the script - make sure that the collection is initialized with the source `parsed_school.json` file 
    and has not undergone any changes.