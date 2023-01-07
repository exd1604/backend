Back end project for P6
Uses Express, mongoose (mongodb), bcrypt, jsonwebtoken, multer, dotenv

PIIQUANTE – Backend Structure

GENERAL
-------
Host: localhost
Port: 3000
User Route: api/auth/
Sauce Route: api/sauces/

Description:
------------
Piiquante creates spicy sauces for which recipes are kept secret. To gain visibility, company creates a web application where users can add there preferred sauces, like or dislike sauces added by others.
This document describes the component managing the backend process.

Getting started:
----------------
The app listens exclusively the localhost:3000 port. If this port is not available then restart when the port 3000 is free.
To start the server please run: node server in a terminal screen.
Once done the process will indicate server is started and connected to database. If not, an error will be displayed.

Playing with the API:
---------------------
To get a feel of what the API is doing, you can use POSTMAN to submit requests. Details are below for each of the possible route.
The API needs authentication. A token will be returned to you when you login with a valid usedId/Password. If not sign up to register and get granted for use.
Once you have logged in, please copy the returned token and paste it in all requests related to sauces.
Copy the system userId (Returned when you login) as well as some routes require a user id.
Please note that you will be able to:
- Display ALL existing sauces
- Display one particular sauce
- Like or dislike a sauce
- Create new sauce(s)
ONLY IF YOU ARE THE SAUCE OWNER (You created it) you will be able to:
-	Delete the sauce
-	Amend the sauce (Description and/or image). 

ROUTES:
-------
Users
-----
Http Address: http://localhost:3000/api/auth/

SignUP:
-------
Route: signup
Method: post
Body sample:
{
    "email": "sample.sample@sample.com",
    "password": "password”
}

Login:
------
Route: login
Method: Post
Body:
{
    "email": "sample.sample@sample.com",
    "password": "password”
}

Returns the system userId and your allocated token. Copy those as you will need to set them on sauce routes.

SAUCES
------
Http Address: http://localhost:3000/api/sauces/
All sauce routes require the authentication token to be entered in the headers tab. 
Key is: Authorization
Value is: Bearer Token value returned to you when you logged in. 
Sample token: 
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2I3YWUxYTFlM2UyZDNjYmEzMDkxNTciLCJpYXQiOjE2NzI5ODU3MTksImV4cCI6MTY3MzA3MjExOX0.itIcn9kQvuGxy6PWv30hDx_It6uCN26qzWNQxkTzNJg

Create a sauce:
---------------
Route: 
Method: post
Body:
Form Data
sauce: {"name":"Nouvelle sauce","manufacturer":"Maille Maille","description":"momomomo","mainPepper":"red","heat":3,"userId":"63ac0c53178b146320974af0"}
image: file

Amend a sauce: (With an image File)
-----------------------------------
Route: :id
Method: put
Body:
Form Data (Similar to sauce creation)
sauce: {"name":"Amended name","manufacturer":"Changed manufacturer","description":"Amended description","mainPepper":"Blue","heat":5,"userId":"63b6a316a26f67ece814f293"}
image: file

Amend a sauce: (Without image File)
-----------------------------------
Route: :id
Method: put
Body: JSON
{
"name":"My changed name",
"manufacturer":"My new manufacturer",
"description":"My new description",
"mainPepper":"Red",
"heat":9,
"userId":"63b6a316a26f67ece814f293"
}

Like / Dislike a sauce:
-----------------------
Route: :id/like
Method: post
Body: JSON
{
"userId":"63b6a316a26f67ece814f293",
"like":1
}
 
Get All Sauces
--------------
Route: 
Method: Get
Body: NONE
 

Get One Sauce
-------------
Route: :id
Method: Get
Body:
NONE

Delete One Sauce
----------------
Route: :id
Method: Delete
Body: NONE