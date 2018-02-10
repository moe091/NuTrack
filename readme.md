# NuTrack

### Overview

NuTrack is a Single-Page Web Application that helps users plan their food/nutrient consumption and track their progress. It's full of features that make it super simple and fast to add food products and meals to your tracker/planner as well as find, creating, and organizing your most commonly used food products, recipes, and meals.
Create an account for free to get started, NuTrack takes no time at all to set up and is dead simple to get started with. As you use the app and build up your tracker, planner, and meal/recipe library, it will become even easier and quicker to use while providing more valuable insights into your nutrition habits.
NuTrack is actively being worked on, and has many awesome features in the works. It is ready-to-use right now, but will be updated with a few more critical features in the near future that greatly improve the simplicity, appearance, and functionality of the app. Check out the TODO list for details on what to expect.



## To-Do List
- Create UserHome page
- Create Item Details page
- Pull in images from google image search for each item to display on item pages and search results
- Add Custom Items, create 'Create Custom Item' and 'Custom Items' pages/components
- Improve search results by doing some custom ordering/filtering on the results returned by USDA API
- High-Quality site redesign with Mobile/Responsiveness improvements(contact me if you are a skilled designer and interested in working on this project: mnowicki091@gmail.com)



## Getting Started

### To get NuTrack running locally, follow these steps:
- Install MongoDB or run a Mongo database remotely, replace line 25 of App.js to point to your database
- Run npm install to install dependencies
- Run node ./bin/www to start server (replace node with nodemon or whatever you want)
- Server will run on port 3001 if environment has no PORT value, otherwise it will run on ENV.PORT
- connect to server in a web browser, site should be up and running

### To modify NuTrack there are a few things you'll need
- You'll need to compile SASS .scss files after editing styles, run 'npm run scss' to watch .scss files and auto-compile them to css
- Run 'npm run build' to watch JSX files, so that updates will be compiled in the /public/js/bundle.js file
- Any page using React components/JSX will need to link the /public/js/bundle.js file
- To include SASS styles just link to /public/css/global.css
- To Run tests, just run 'npm run test'
- Tests can be found in the test/tests folder, and must end with _test.js to be picked up by test runner



## Contact

NuTrack was created entirely by Maurice Nowicki. Contact by email at MNowicki091@gmail.com
If you have any questions, suggestions, or just want to talk about development, don't hesitate to email me - I won't mind!
