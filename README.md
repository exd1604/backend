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
To start the server please run: node server in a terminal screen
Once done the process will indicate server is started and connected to database. If not, an error will be displayed.

A set of app variables are necessary in a .env file
MONGODB access parameters: Cluster, Name, User Id, Password 
BCRYPT: Number of salt rounds (Recommended 10 - More would be consume too much resource)
JSON Web Token: Secret Key  

Secret Key: I used https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx to generate all sort of random keys (WPA, WEP, Encryption keys, passwords. Propose various levels (64, 128, 256, 512, 1024, 2048, 4096 bits)).
Many other sites can do same thing. 

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
Sauce routes are only available for users logged in.
So you need to login first and get a signed token for you user to require sauces 
otherwise you'll get an error returned for any sauce route.
All sauce routes require the authentication token to be entered in the headers tab. 
Key is: Authorization
Value is: Bearer Token value returned to you when you logged in. 
Sample token: 
Bearer Header.Payload.Signature
Token is returned when you login the app.
Create a sauce:
---------------
Route: 
Method: post
Body:
Form Data
sauce: {"name":"Nouvelle sauce","manufacturer":"Maille Maille","description":"momomomo","mainPepper":"red","heat":3,"userId":"MongoDB userid"}
image: file

Amend a sauce: (With an image File)
-----------------------------------
Route: :id - (:id - Sauce mongodb id that you need to enter in the params tab)
Method: put
Body:
Form Data (Similar to sauce creation)
sauce: {"name":"Amended name","manufacturer":"Changed manufacturer","description":"Amended description","mainPepper":"Blue","heat":5,"userId":"MongoDB userid"}
image: file

Amend a sauce: (Without image File)
-----------------------------------
Route: :id - (:id - Sauce mongodb id that you need to enter in the params tab)
Method: put
Body: JSON
{
"name":"My changed name",
"manufacturer":"My new manufacturer",
"description":"My new description",
"mainPepper":"Red",
"heat":9,
"userId":"MongoDB userid"
}

Like / Dislike a sauce:
-----------------------
Route: :id/like (:id - Sauce mongodb id that you need to enter in the params tab)
Method: post
Body: JSON
{
"userId":"MongoDB userid",
"like":1
}
 
Get All Sauces
--------------
Route: 
Method: Get
Body: NONE

Get One Sauce
-------------
Route: :id - (:id - Sauce mongodb id that you need to enter in the params tab)
Method: Get
Body:
NONE

Delete One Sauce
----------------
Route: :id - (:id - Sauce mongodb id that you need to enter in the params tab)
Method: Delete
Body: NONE