## 📝 Population statistics app

Application that is working with a `json` file as a database.\
Will refer the json file as the database of the application.

### Starting the project:
Prerequisites:
`node` and `npm` installed on the machine.

Clone the project. \
Navigate to its directory.

#### Backend
Navigate to backend directory and run:\
`npm install` \
`npm run start:dev`\
This command will start the backend server on http://localhost:3000.

Supported Endpoints:
- `GET /` \
    **returns** all the cities available in the database along with density field
- `GET /sort/{sortProperty}/{sortOrder}` \
    `sortProperty` must be one of the following - `name`, `area`, `population`\
    `sortOrder` must be one of the following - `asc`, `desc` \
    **returns** cities sorted by `sortProperty` in `sortOrder` 
- `GET /filter/{searchTerm}` \
    `searchTerm` search criteria for filtering cities by name \
    **returns** only cities whose name contains `searchTerm`
- `POST /add` \
    request `body` should follow the following structure: \
    `{
        "name": "the name of the new city",
        "area": 123,
        "population": 123
    }`\
    `name` should of type `string`, `area` should be of type `number`, and `population` should be of type `number`\
    all of these parameters are required\
    **returns** the newly created city 

---

#### Frontend

Navigate to frontend directory and run:\
`npm install` \
if angular CLI is present on the machine:
`ng serve` or `ng serve -o`\
otherwise run:
`npm run start`\
This command will start the frontend application on http://localhost:4200.

Supported routes:
- `/` \
displays a table with all the cities that are currently available in the backend's database, \
the cities with population over a million will be highlighted

#### ❗The UI will not display any data unless the backend is also running.

---

#### Tech stack:

- Angular
- Angular Material
- Node.js
- TypeScript
- CSS
- Jest

---