<h1>Skill Seeker API</h1>
<p>Skill Seeker API is a RESTful API that provides users the ability to log into an account and leave comments and likes for businesses. The API is built with Node.js, Express and MySQL.</p>
<p>The API uses JSON Web Tokens (JWT) for authentication and authorization. To access any protected route, you need to send a valid token in the Authorization header with the format "Bearer token". You can obtain a token by logging in with an existing user account. If you do not have an account you must first create one.</p>
<p>The front end for this project as well as a more in-depth readme can be found at https://github.com/bleaman/BrainStation-Capstone-Client</p>
<h2>Users routes</h2>
<table>
  <tr>
    <th>Method</th>
    <th>Path</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>POST</td>
    <td>/users/login</td>
    <td>Log in a user with email and password. Returns a token and user data.</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/users</td>
    <td>Get all users. Requires authentication.</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/users</td>
    <td>Create a new user with name, email and password. Returns a token and user data.</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/users/:user_id</td>
    <td>Get a user by id. Requires authentication.</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/users/:user_id</td>
    <td>Update a user by id. Requires authentication and ownership of the user.</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/users/:user_id</td>
    <td>Delete a user by id. Requires authentication and ownership of the user.</td>
  </tr>
</table>

<h2>Businesses routes</h2>

<table>
  <tr>
    <th>Method</th>
    <th>Path</th>
    <th>Description</th>
  </tr>

  <tr>
    <td>GET</td>
    <td>/business</td>
    <td>Get all businesses. Requires authentication.</td>
  </tr>

  <tr>
    <td>POST</td>
    <td>/business</td>
    <td>Create a new business with name, description, category and location. Requires authentication.</td>
  </tr>

  <tr>
    <td>GET</td>
    <td>/business/:business_id</td>
    <td>Get a business by id. Requires authentication.</td>
  </tr>

  <tr>
    <td>PUT</td>
    <td>/business/:business_id</td>
    <td>Update a business by id. Requires authentication and ownership of the business.</td>
  </tr>

  <tr>
    <td>DELETE</td>
    <td>/business/:business_id</td>
    <td>Delete a business by id. Requires authentication and ownership of the business.</td>
  </tr>

</table>

<h2>Comments routes</h2>

<table>
  <tr>
    <th>Method</th>
    <th>Path</th>
    <th>Description</th>
  </tr>

  <tr>
    <td>GET</td>
    <td>/business/:business_id/comments</td>
    <td>Get all comments for a business by id. Requires authentication.</td>
</tr>
<tr>
  <td>POST</td>
  <td>/business/:business_id/comments</td>
  <td>Create a new comment for a business by id with text and rating. Requires authentication.</td>
</tr>
<tr>
  <td>GET</td>
  <td>/users/:user_id/comments</td>
  <td>Get all comments for a user by id. Requires authentication.</td>
</tr>
</table>

<h2>Likes routes</h2>

<table>
<tr>
  <th>Method</th>
  <th>Path</th>
  <th>Description</th>
</tr>
<tr>
  <td>GET</td>
  <td>/business/:business_id/likes</td>
  <td>Get all likes for a business by id. Requires authentication.</td>
</tr>
<tr>
  <td>POST</td>
  <td>/business/:business_id/likes</td>
  <td>Like or unlike a business by id. Requires authentication.</td>
</tr>
</table>
