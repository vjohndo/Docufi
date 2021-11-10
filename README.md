# Docufi

Docufi helps you sort through documents without needing to read through every single line. Using Microsoft Azure's Cognitive Service for Text Analytics, Docufi employs Natural Language Processing (NLP) to help you classify your documents by idenfying entities such as people, places, and organisations to understand common topics and trends. Upload your PDFs for processing, sort by sentiment and gain a deeper understanding of your documents.



# How To Develop Locally

This app was built on Node.js and is an Express app. You will need to have Node.js installed to run this web app locally. To install all the dependencies, enter the following lines into the terminal

>` npm init `

>` npm install`

You will need to also create a file named .env and add the following information inside 
>NODE_ENV="production"\
ENDPOINT="Your AZURE end point here"\
TEXT_ANALYTICS_API_KEY="<"Your AZURE key here"\
EXPRESS_SESSION_SECRET_KEY="Your secret key here"\
DB_USER="Your secret key here"\
DB_PASSWORD="Your secret key here"\
DB_HOST="Your secret key here"\
DB_NAME="Your local database name here"\

Set the socket instance to local (comment out the production instance) in the client/js/initialize.js file. You can comment out the product endpoint. 

> const socket = io("http://localhost:3000"); 

> // const socket = io("https://docufi.azurewebsites.net/");`

Create your postgres databse and name it docufi:
>` createdb docufi`

Copy schema.sql as SQL commands into your DB


# Application Deployment 
This app has been deployed to Microsoft Azure.

# Architechture


# Technologies Used
- Node.Js
- Express
- Microsoft Azure Conginitive Sercie - Text Analysis
- PostgresDB
- Multer
- Bootstrap
- SocketIO

# Features
- File uploading
- User logins
- NLP results
- SocketIO to manage uploading updates

# Potential Future Additions
- Search by key words and other entity types
- Cloud storage of files

# Contributors
- [@upp22](https://github.com/upp22) (Shaunn Diamond)

 - [@vjohndo](https://github.com/vjohndo) (John Do)