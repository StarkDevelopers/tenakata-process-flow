
# Tenakata USSD Process Flow

## Installation

### Create EC2 Instance

Login to AWS Console and head over to EC2.
Launch a new instance with **Ubuntu Server 18.04 LTS (HVM), SSD Volume Type - ami-01e7ca2ef94a0ae86 (64-bit x86) / ami-0f1a02d93feff123e (64-bit Arm)** machine image and **64-bit (x86)** architecture.
On the Instance Type step, Select **t2** family and **t2.micro** type.
Then, click Review and Launch. It will ask to create a new Key-pair. Download it and store it somewhere safe. You can use it to SSH login into the EC2 instance from your terminal.

### Allow traffic to 8080 port

Go to **Security** section of Instance and click on **Security groups**.
In Security Groups, **Edit Inbound Rules**.
**Add Rule** with following properties

> **Type**: Custom TCP
> **Port range**: 8080
> **Source**: Anywhere

### Setup EC2 Instance

Once EC2 Instance has been created, connect to the instance. You can either connect directly from Browser or using SSH from terminal using the key-pair we downloaded in the previous step.

##### Installing Node and NPM

  sudo apt update
  sudo apt install nodejs
  sudo apt install npm
	nodejs -v
	curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.35.3/install.sh -o install_nvm.sh
	nano install_nvm.sh
	bash install_nvm.sh
	nvm install 12.16.1
	nvm use 12.16.1
	nvm alias default 12.16.1
	
##### Installing PM2

  npm install pm2@latest -g

##### Installing Redis

> https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04

##### Upload Source Code

Upload source code to your preferred location.

##### Add .env file

Create a **.env** file at the same level as *server.js* file.

Paste following content in it. Enter your Redis password that you selected while installing Redis.

  PORT=8080
	REDIS_SERVER=127.0.0.1
	REDIS_SERVER_PORT=6379
	REDIS_SERVER_AUTH_PASSWORD=<ENTER YOUR REDIS PASSWORD>
	API_ENDPOINT=http://ec2-18-219-231-177.us-east-2.compute.amazonaws.com/index.php

##### Install Dependencies

Execute following command to install dependencies

  npm i

##### Start Server

  pm2 start server.js

### Get IP address and DNS

On the Instance Summary/Details page, you can find **Public IPv4 address** and **Public IPv4 DNS**.