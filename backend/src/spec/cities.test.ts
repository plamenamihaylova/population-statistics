import supertest from "supertest";
import createServer from "../utils/server";
import { describe } from 'node:test';
import data from '../cities.json';
import { BAD_POST_REQUEST_ERR_MSG, BAD_REQUEST, INVALID_SORT_ORDER_ERR_MSG, INVALID_SORT_PROPERTY_ERR_MSG } from '../constants';

const app = createServer();

describe('GET /', () => {
  it('Should get all the cities from data file', async () => {
    await supertest(app).get("/").expect(200).expect(data);
  });
});

describe('GET /density', () => {
  test('Should get all cities with density calculated and added to the response object', async () => {
    const response = await supertest(app).get("/density").expect(200);
    expect(response.body[0].density).not.toBe(undefined);
  });
});

describe('GET /sort/:property/:order', () => {

  const firstRandomNum = Math.floor(Math.random() * data.length - 1);
  const secondRandomNum = Math.floor(Math.random() * ((data.length - 1) - (firstRandomNum + 1)) + (firstRandomNum + 1));

  it('Should get sorted cities by name in ascending order', async () => {
    const response = await supertest(app).get("/sort/name/asc").expect(200);
    expect(response.body).not.toEqual(data);
    expect(response.body[firstRandomNum].name <= response.body[secondRandomNum].name).toBe(true);
  });

  it('Should get sorted cities by area in ascending order', async () => {
    const response = await supertest(app).get("/sort/area/asc").expect(200);
    expect(response.body).not.toEqual(data);
    expect(response.body[firstRandomNum].area <= response.body[secondRandomNum].area).toBe(true);
  });

  it('Should get sorted cities by population in ascending order', async () => {
    const response = await supertest(app).get("/sort/population/asc").expect(200);
    expect(response.body).not.toEqual(data);
    expect(response.body[firstRandomNum].population <= response.body[secondRandomNum].population).toBe(true);
  });

  it('Should get sorted cities by name in descending order', async () => {
    const response = await supertest(app).get("/sort/name/desc").expect(200);
    expect(response.body).not.toEqual(data);
    expect(response.body[firstRandomNum].name >= response.body[secondRandomNum].name).toBe(true);
  });

  it('Should get sorted cities by area in descending order', async () => {
    const response = await supertest(app).get("/sort/area/desc").expect(200);
    expect(response.body).not.toEqual(data);
    expect(response.body[firstRandomNum].area >= response.body[secondRandomNum].area).toBe(true);
  });

  it('Should get sorted cities by population in descending order', async () => {
    const response = await supertest(app).get("/sort/population/desc").expect(200);
    expect(response.body).not.toEqual(data);
    expect(response.body[firstRandomNum].population >= response.body[secondRandomNum].population).toBe(true);
  });

  it("Should get error if sort property is not valid", async () => {
    const expectedError = {
      error: BAD_REQUEST, message: INVALID_SORT_PROPERTY_ERR_MSG
    }
    await supertest(app).get("/sort/test/desc").expect(400).expect(expectedError);
  })

  it("Should get error if sort order is not valid", async () => {
    const expectedError = {
      error: BAD_REQUEST, message: INVALID_SORT_ORDER_ERR_MSG
    }
    await supertest(app).get("/sort/name/test").expect(400).expect(expectedError);
  })

  it("Should get error if both sort property and sort order are not valid. First thrown error is for sort property.", async () => {
    const expectedError = {
      error: BAD_REQUEST, message: INVALID_SORT_PROPERTY_ERR_MSG
    }
    await supertest(app).get("/sort/test/test").expect(400).expect(expectedError);
  })
});

describe('GET /filter/:searchTerm', () => {
  it('Should get cities filtered by name according to search term', async () => {
    const expectedResult = {
      "name": "New York", "area": 468.9, "population": 8398748
    }
    await supertest(app).get("/filter/New%20York").expect(200).expect([expectedResult]);
  });

  it('Should get cities containing search term in their name', async () => {
    const expectedResult = data.filter((item) => {
      if (item.name.toLowerCase().includes('ne')) return item;
    })
    await supertest(app).get("/filter/ne").expect(200).expect(expectedResult);
  });

  it('Should get no cities if filtered by non-existent city name', async () => {
    await supertest(app).get("/filter/test").expect(200).expect([]);
  });

  it('Should get error if search term is not specified', async () => {
    const expectedError = {
      error: 'Error', message: 'Not Found - GET /filter/',
    }
    await supertest(app).get("/filter/").expect(404).expect(expectedError);
  });
});

describe('POST /add', () => {
  it('Should not add new city and get an error when the request body does not contain the required params', async () => {
    const payload = {
      name: "test", area: 12
    }
    const expectedError = {
      error: BAD_REQUEST, message: BAD_POST_REQUEST_ERR_MSG
    }
    await supertest(app).post('/add').send(payload).expect(400).expect(expectedError);
  })
})

describe('Call invalid endpoint', () => {
  it('Should get an error when trying to call invalid endpoint', async () => {
    const expectedError = {
      error: 'Error', message: 'Not Found - GET /test',
    }
    await supertest(app).get("/test").expect(404).expect(expectedError);
  });
});
