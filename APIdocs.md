API Documentation 

User Authentication Routes 

POST /register 

Description: Registers a new user. 

Request Body: 

 
{ 
  "name": "John Doe", 
  "email": "john@example.com", 
  "password": "password123", 
  "password_confirmation": "password123" 
} 
 

Response: 

 
- Success (201): 
{ 
  "message": "User registered successfully.", 
  "user": { 
    "id": 1, 
    "name": "John Doe", 
    "email": "john@example.com" 
  }, 
  "token": "generated_token_here" 
} 
- Error (422): 
{ 
  "errors": { 
    "email": ["The email has already been taken."] 
  } 
} 
 

POST /login 

Description: Logs in a user and returns a token. 

Request Body: 

 
{ 
  "email": "john@example.com", 
  "password": "password123" 
} 
 

Response: 

 
- Success (200): 
{ 
  "message": "Login successful.", 
  "user": { 
    "id": 1, 
    "name": "John Doe", 
    "email": "john@example.com" 
  }, 
  "token": "generated_token_here" 
} 
- Error (401): 
{ 
  "error": "Unauthorized" 
} 
 

POST /logout 

Description: Logs out the authenticated user. 

Middleware: `auth:sanctum` 

Response: 

 
- Success (200): 
{ 
  "message": "Logout successful." 
} 
 

GET /user 

Description: Retrieves the details of the authenticated user. 

Middleware: `auth:sanctum` 

Response: 

 
- Success (200): 
{ 
  "id": 1, 
  "name": "John Doe", 
  "email": "john@example.com" 
} 
 

Post Routes 

GET /posts 

Description: Retrieves a list of posts with pagination. 

Query Parameters: 

 
- `mine` (optional): Filter posts by the authenticated user. 
- `author` (optional): Filter posts by author ID. 
- `sort` (optional): Sort posts by a field (e.g., `likes`). 
- `order` (optional): Sort order (`desc` or `asc`). 
 

Response: 

 
- Success (200): 
{ 
  "success": true, 
  "data": [ 
    { 
      "id": 1, 
      "title": "First Post", 
      "content": "Content of the first post", 
      "likes_count": 10, 
      "user": { 
        "id": 1, 
        "name": "John Doe" 
      } 
    } 
  ] 
} 
 

POST /posts 

Description: Creates a new post. 

Request Body: 

 
{ 
  "title": "New Post", 
  "content": "Content of the new post" 
} 
 

Response: 

 
- Success (201): 
{ 
  "success": true, 
  "message": "Post created successfully.", 
  "data": { 
    "id": 2, 
    "title": "New Post", 
    "content": "Content of the new post", 
    "likes_count": 0, 
    "user": { 
      "id": 1, 
      "name": "John Doe" 
    } 
  } 
} 
 

GET /posts/{post} 

Description: Retrieves a specific post by ID. 

Response: 

 
- Success (200): 
{ 
  "success": true, 
  "data": { 
    "id": 1, 
    "title": "First Post", 
    "content": "Content of the first post", 
    "likes_count": 10, 
    "user": { 
      "id": 1, 
      "name": "John Doe" 
    } 
  } 
} 
 

PUT /posts/{post} 

Description: Updates a specific post by ID. 

Request Body: 

 
{ 
  "title": "Updated Post", 
  "content": "Updated content of the post" 
} 
 

Response: 

 
- Success (200): 
{ 
  "success": true, 
  "message": "Post updated successfully.", 
  "data": { 
    "id": 1, 
    "title": "Updated Post", 
    "content": "Updated content of the post", 
    "likes_count": 10, 
    "user": { 
      "id": 1, 
      "name": "John Doe" 
    } 
  } 
} 
 

DELETE /posts/{post} 

Description: Deletes a specific post by ID. 

Response: 

 
- Success (200): 
{ 
  "success": true, 
  "message": "Post deleted successfully." 
} 
 

POST /posts/{post}/like 

Description: Likes a post. 

Response: 

 
- Success (200): 
{ 
  "success": true, 
  "message": "Post liked successfully.", 
  "likes_count": 11 
} 
 

DELETE /posts/{post}/like 

Description: Removes a like from a post. 

Response: 

 
- Success (200): 
{ 
  "success": true, 
  "message": "Like removed successfully.", 
  "likes_count": 10 
} 
 

Author Routes 

GET /authors 

Description: Retrieves a list of all authors. 

Response: 

 
- Success (200): 
[ 
  { 
    "id": 1, 
    "name": "John Doe", 
    "email": "john@example.com" 
  } 
] 
 

GET /authors/{id} 

Description: Retrieves details of a specific author, including their posts and post count. 

Response: 

 
- Success (200): 
{ 
  "author": { 
    "id": 1, 
    "name": "John Doe", 
    "email": "john@example.com" 
  }, 
  "posts": [ 
    { 
      "id": 1, 
      "title": "First Post", 
      "content": "Content of the first post", 
      "likes_count": 10 
    } 
  ], 
  "post_count": 1 
} 
 

PUT /authors/{id} 

Description: Updates the details of an author. 

Request Body: 

 
{ 
  "name": "Updated Name", 
  "email": "updated.email@example.com" 
} 
 

Response: 

 
- Success (200): 
{ 
  "message": "Profile updated successfully.", 
  "author": { 
    "id": 1, 
    "name": "Updated Name", 
    "email": "updated.email@example.com" 
  } 
} 
 

DELETE /authors/{id} 

Description: Deletes an author and their related posts. 

Response: 

 
- Success (200): 
{ 
  "message": "Author deleted successfully." 
} 
 

Error Responses 

401 Unauthorized 

Returned when an action requires authentication. 

 
{ 
  "error": "Unauthorized" 
} 
 

403 Forbidden 

Returned when a user tries to access or modify another user's data. 

 
{ 
  "error": "You cannot edit another user's profile." 
} 
 

422 Unprocessable Entity 

Returned when validation fails (e.g., missing or incorrect fields). 

 
{ 
  "errors": { 
    "email": ["The email has already been taken."] 
  } 
} 
 