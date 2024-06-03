# Slidify by MAC

## Team members with @mail.utoronto.ca emails

* Mohamed Besey: mohamed.besey@mail.utoronto.ca
* Amy Li: amym.li@mail.utoronto.ca
* Christine Zhao: christine.zhao@mail.utoronto.ca

## Brief description of the web application

Web application that transforms a video into a fully formed 
Google Slideshow presentation.

## Bullet points outlining how to fulfill "Required Elements"

* Using Vue 3 for the frontend framework

* Using Express as the core backend API

* Deployed on a virtual machine using Docker and Docker Compose

* The application must interact with at least one third-party API.
  * Google Slides API
  * Google Speech-to-Text API
  * API to summarize content

* Using OAuth 2.0 for account creation and sign-up

## Bullet points outlining how to fulfill "Additional Requirements"

* A piece of the application must interact with a webhook by an external service (?)

* A piece of the application is “real-time”, which means it can reflect other
user changes without refreshing
  * Users can see the slides as they are being generated in "real-time"

* A piece of the application has functionality that executes a long-running task
(something that could take more than 10 seconds to complete)
  * Processing the video uploads and generating the slides are 
    long-running tasks

## Your alpha version, beta version, and final version milestones

* Alpha version:
  * Complete frontend basic layout
  * Implement login and user authentication
  * Set-up the third-party APIs
  * Implement Express routes

* Beta version:
  * Video uploading is working
  * The app is able to generate slides from the video
  * Deployed on a public URL
  * Generated slides include an accompanying script for the speaker

* Final version:
  * Slides generation from video upload is fully functional
  * Users can see their slides history
