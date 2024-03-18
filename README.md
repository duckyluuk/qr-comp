# QR Competition
A discord bot where users can create their individual URL + QR code which will redirect to the Never Gonna Give You Up music video.

## Setup
The setup consists of 3 parts:
- Creating a discord bot
- Creating a database
- Starting the server + bot

### Creating a discord bot
- Go to `https://discord.com/developers/applications` and click `New Application` to create a new discord bot.
- Set a name, icon, etc as needed
- Go to the Bot section on the left, click `Reset Token`, and then copy the token and paste it in the .env file like `token=xxxxx.xxx.xxxxx`.
  - If you do did not create the .env file yet, you can simply create a new file, name it .env, and copy the contents of example.env.
- You can add the bot to your server by going to the OAuth2 section on the bot page, scrolling to the bottom, selecting the `Bot` scope, selecting the needed permissions and then copying and opening the link that is generated.

### Creating a database
The database used by this project is Mongodb. This is a nosql database hosted in the cloud.
You can set up and connect a database by the following steps:
- Go to [https://cloud.mongodb.com/](https://cloud.mongodb.com/) and sign up / log in.
- Create a new project and go through the following few pages, setting a project name etc. (other settings can be left at defaults)
- In the Overview, create a new deployment (the big green `Create` button)
- Select the M0 template (this is the free one), choose a cluser name, uncheck the `Add sample dataset` checkbox, and leave all other settings at default.
- Once the cluser is created, in the `create a database user` section, set a username and password for the application to connect to your database, and click create database user.
- In the `Choose a conneciton method` / `Connect to your application` screen, select `Drivers`. Leave the options at default and copy the connection string into the .env file created earlier
  - It should look like `db_uri=mongo+srv://user:password@cluster.xxx.mongodb.net/?xxx`.
- On the mongodb page, go to `Network Access` on the left, click `Add IP Address`, and select `Allow access from anywhere` (this will add the ip `0.0.0.0/0`), to allow your application to access the database.
  - You can also allow the specific IP where your server will be running, but it doesn't matter very much security-wise, and this is much easier.


### Starting the server + bot
- Make sure you have [NodeJS](https://nodejs.org/en/download) installed on your system.
- Install the dependencies using `npm install`.
- Start the server using `npm run start`.

The web server will be live (by default on http://localhost:3000) and the bot should be started.  
You can run the `/help` command in the discord server which you added the bot in to get more info on using the bot, visit `http://localhost:3000` for the webpage, and any shortened URLs will be found at `http://localhost:3000/urlalias`.

## Running locally and remotely
URLs / QR codes will NOT work for other people if you have the project running locally. Instead you will need to host it on a server for other people to be able to access it.  
When the project is hosted remotely, you will also need to change the `site_url` in the .env file to the correct hostname.

## Project Progress
- [x] Working URL redirects
- [x] QR code generation
- [x] Leaderboard
- [x] URL aliases
- [ ] Frontend page