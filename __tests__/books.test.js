process.env.NODE_ENV = 'test';

const app = require('../app');
const db = require('../db');

const request = require('supertest');

const isbn = '1111111112';

beforeAll(async () => {
	await db.query(`DELETE FROM books`);
	const results = await db.query(`INSERT INTO books
	(isbn, amazon_url, author, language, pages, publisher, title, year)
	VALUES(
	  '1111111112',
	  'https://mybook.com',
	  'Ethan',
	  'English',
	  250,
	  'Publisher Name',
	  'my first book',
	  1999)`);
});

describe('Get book and books', function() {
	test('get a book by id', async function() {
		const response = await request(app).get(`/books/1111111112`);
		expect(response.statusCode).toBe(200);
	});
	test('get all books', async function() {
		const response = await request(app).get('/books');
		expect(response.statusCode).toBe(200);
		expect(response.body.books).toHaveLength(1);
	});
});

describe('POST a book', function() {
	test('Creates a new book', async function() {
		const response = await request(app).post(`/books`).send({
			isbn: '111111113',
			amazon_url: 'https://postbook.com',
			author: 'ethan',
			language: 'english',
			pages: 100,
			publisher: 'publisher 2',
			title: 'used to',
			year: 1999
		});
		expect(response.statusCode).toBe(201);
	});
});

describe('Edit a book', function() {
	test('edit the book', async function() {
		const response = await request(app).put(`/books/${isbn}`).send({
			isbn: '111111113',
			amazon_url: 'https://editedbook.com',
			author: 'ethan 2.0',
			language: 'spanish',
			pages: 2,
			publisher: 'publisher 1',
			title: 'edited',
			year: 3030
		});
		expect(response.statusCode).toBe(200);
	});
});

describe('Delete a book', function() {
	test('delete the book', async function() {
		const response = await request(app).delete(`/books/${isbn}`);
		expect(response.statusCode).toBe(200);
	});
});
