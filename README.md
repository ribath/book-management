# Book Management API

A RESTful API built with NestJS for managing books and authors.

## Prerequisites

- Node.js (v18 or higher)
- Yarn (v1.22 or higher)
- PostgreSQL (v14 or higher)

## Getting Started

### 1. Install Dependencies

```bash
yarn install
```

### 2. Database Setup

#### Create Databases

Create two PostgreSQL databases for development and testing:

**`your_dev_database_name`** - used for local development
**`your_test_database_name`** - used exclusively for running e2e tests

#### Configure Environment Variables

> **Important:** Update the database credentials in the `.env` according to your local PostgreSQL setup if needed.

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=your_dev_database_name
DB_TEST_NAME=your_test_database_name
```

### 3. Run Database Migrations

```bash
# Run migrations for development database
yarn migrations:run
```

### 4. Start the Application

#### Development Mode

```bash
yarn start:dev
```

The API will be available at `http://localhost:3000`


## Testing

### Run Tests

```bash
# Run all e2e tests
yarn test:e2e

# Run all unit tests
yarn test
```

> **Note:** E2E tests use the test database specified in `.env.test`. The database is automatically cleaned before each test suite.


## API Documentation

Once the application is running, you can access:

- **Swagger Documentation**: `http://localhost:3000/api`


## Sharing some insights on the task

1. I have used PostgreSQL for this project because for this task choosing a relational database seemed like the better choice. And I feel more comfortable working with relational databases as I have more experience on them.
2. Entity synchronization has been intentionally disabled in favor of migrations, as synchronization is unreliable and not recommended for production environments.
3. Swagger has been implemented at a basic level to provide foundational API documentation.
4. For Author deletion, soft delete would typically be the preferred approach. However, due to uncertainty about handling associated books (whether to orphan them, reassign them, or delete them as well), I opted for cascade deletion instead. This ensures referential integrity.
