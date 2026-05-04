this is logistic management platform where the user can add jobs and truck owners can bid for each job, lowest bid wins. this project will contain a reverse auction engine and ability to accomodate several bids at once also a route optimization module for driver to pickup other job on their way, and an AI assitant for both driver and the job poster, employer will have a dashboard to manage the fleet.


Important 
backedn logic
this project follows ddd pattern, every domain, application and mapper
use the mapper to map the response with the required DTO
every database functions like model definition and repository should be inside the domain including any required enum


frontend
this project uses react as frontend use typescript to be type safe,
Frontend should follow feature based patterns
every pattern 
every component should be under the particular feature it belongs along the with api calls under api folder of each feature
name each folder with apps feature
write every api calls in api file
put all the pages of the feature under pages folder in feature folder
use the common folder to encoporate common components that can be used across several feature examples button, banner,..etc.