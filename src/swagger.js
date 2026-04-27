const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Library Management System API",
    version: "1.0.0",
    description:
      "REST API for managing a library system with books, categories, and borrow records.",
  },
  servers: [
    { url: "/api", description: "API server" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          username: { type: "string", example: "john" },
          email: { type: "string", example: "john@example.com" },
          role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
        },
      },
      Book: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Clean Code" },
          author: { type: "string", example: "Robert C. Martin" },
          isbn: { type: "string", example: "9780132350884" },
          categoryId: { type: "integer", example: 2 },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Fiction" },
          description: { type: "string", example: "Fiction books including novels" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Borrow: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          userId: { type: "integer", example: 3 },
          bookId: { type: "integer", example: 1 },
          borrowDate: { type: "string", format: "date-time" },
          dueDate: { type: "string", format: "date-time" },
          returnDate: { type: "string", format: "date-time", nullable: true },
          status: { type: "string", enum: ["BORROWED", "RETURNED"], example: "BORROWED" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
  paths: {
    // ==================== AUTH ====================
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Create a new user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string", example: "newuser" },
                  email: { type: "string", example: "newuser@example.com" },
                  password: { type: "string", example: "Password123!" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
            content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
          },
          400: { description: "Missing or invalid fields" },
          409: { description: "Email or username already exists" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in and receive a JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "admin@example.com" },
                  password: { type: "string", example: "Admin123!" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { token: { type: "string" } },
                },
              },
            },
          },
          400: { description: "Missing email or password" },
          401: { description: "Invalid email or password" },
        },
      },
    },

    // ==================== BOOKS ====================
    "/books": {
      get: {
        tags: ["Books"],
        summary: "Get all books",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of books",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Book" } },
              },
            },
          },
          401: { description: "Not authenticated" },
        },
      },
      post: {
        tags: ["Books"],
        summary: "Add a new book (Admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "author", "isbn", "categoryId"],
                properties: {
                  title: { type: "string", example: "New Book" },
                  author: { type: "string", example: "Author Name" },
                  isbn: { type: "string", example: "9781234567890" },
                  categoryId: { type: "integer", example: 1 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Book created",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Book" } } },
          },
          400: { description: "Missing or invalid fields" },
          401: { description: "Not authenticated" },
          403: { description: "Not an admin" },
          404: { description: "Category not found" },
          409: { description: "ISBN already exists" },
        },
      },
    },
    "/books/{id}": {
      get: {
        tags: ["Books"],
        summary: "Get a book by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 },
        ],
        responses: {
          200: {
            description: "Book details",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Book" } } },
          },
          400: { description: "Invalid ID" },
          401: { description: "Not authenticated" },
          404: { description: "Book not found" },
        },
      },
      put: {
        tags: ["Books"],
        summary: "Update a book (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Updated Title" },
                  author: { type: "string", example: "Updated Author" },
                  isbn: { type: "string", example: "9780132350884" },
                  categoryId: { type: "integer", example: 1 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Book updated",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Book" } } },
          },
          400: { description: "Invalid ID or fields" },
          401: { description: "Not authenticated" },
          403: { description: "Not an admin" },
          404: { description: "Book not found" },
          409: { description: "ISBN already exists" },
        },
      },
      delete: {
        tags: ["Books"],
        summary: "Delete a book (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 },
        ],
        responses: {
          200: {
            description: "Book deleted",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Book" } } },
          },
          400: { description: "Invalid ID" },
          401: { description: "Not authenticated" },
          403: { description: "Not an admin" },
          404: { description: "Book not found" },
        },
      },
    },

    // ==================== CATEGORIES ====================
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "Get all categories",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of categories",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Category" } },
              },
            },
          },
          401: { description: "Not authenticated" },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Create a new category (Admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "description"],
                properties: {
                  name: { type: "string", example: "Technology" },
                  description: { type: "string", example: "Technology and computing books" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Category created",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Category" } } },
          },
          400: { description: "Missing or invalid fields" },
          401: { description: "Not authenticated" },
          403: { description: "Not an admin" },
          409: { description: "Category name already exists" },
        },
      },
    },
    "/categories/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Get a category by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 },
        ],
        responses: {
          200: {
            description: "Category details",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Category" } } },
          },
          400: { description: "Invalid ID" },
          401: { description: "Not authenticated" },
          404: { description: "Category not found" },
        },
      },
      put: {
        tags: ["Categories"],
        summary: "Update a category (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Literary Fiction" },
                  description: { type: "string", example: "Updated description" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Category updated",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Category" } } },
          },
          400: { description: "Invalid ID or fields" },
          401: { description: "Not authenticated" },
          403: { description: "Not an admin" },
          404: { description: "Category not found" },
          409: { description: "Category name already exists" },
        },
      },
      delete: {
        tags: ["Categories"],
        summary: "Delete a category (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 },
        ],
        responses: {
          200: {
            description: "Category deleted",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Category" } } },
          },
          400: { description: "Invalid ID" },
          401: { description: "Not authenticated" },
          403: { description: "Not an admin" },
          404: { description: "Category not found" },
        },
      },
    },

    // ==================== BORROWS ====================
    "/borrows": {
      get: {
        tags: ["Borrows"],
        summary: "Get borrow records (users see own, admins see all)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of borrow records",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Borrow" } },
              },
            },
          },
          401: { description: "Not authenticated" },
        },
      },
      post: {
        tags: ["Borrows"],
        summary: "Borrow a book (any authenticated user)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["bookId", "dueDate"],
                properties: {
                  bookId: { type: "integer", example: 2 },
                  dueDate: { type: "string", format: "date", example: "2026-05-15" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Borrow record created",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Borrow" } } },
          },
          400: { description: "Missing or invalid fields" },
          401: { description: "Not authenticated" },
          404: { description: "Book not found" },
          409: { description: "Book is already borrowed" },
        },
      },
    },
    "/borrows/{id}": {
      get: {
        tags: ["Borrows"],
        summary: "Get a borrow record by ID (owner or admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 },
        ],
        responses: {
          200: {
            description: "Borrow record details",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Borrow" } } },
          },
          400: { description: "Invalid ID" },
          401: { description: "Not authenticated" },
          403: { description: "Not the owner or admin" },
          404: { description: "Borrow record not found" },
        },
      },
      put: {
        tags: ["Borrows"],
        summary: "Update a borrow record (owner or admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  returnDate: { type: "string", format: "date", example: "2026-04-10" },
                  status: { type: "string", enum: ["BORROWED", "RETURNED"], example: "RETURNED" },
                  dueDate: { type: "string", format: "date", example: "2026-05-01" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Borrow record updated",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Borrow" } } },
          },
          400: { description: "Invalid ID or fields" },
          401: { description: "Not authenticated" },
          403: { description: "Not the owner or admin" },
          404: { description: "Borrow record not found" },
        },
      },
      delete: {
        tags: ["Borrows"],
        summary: "Delete a borrow record (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 },
        ],
        responses: {
          200: {
            description: "Borrow record deleted",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Borrow" } } },
          },
          400: { description: "Invalid ID" },
          401: { description: "Not authenticated" },
          403: { description: "Not an admin" },
          404: { description: "Borrow record not found" },
        },
      },
    },
  },
};

export default swaggerDocument;
