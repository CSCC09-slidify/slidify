# Slidify by MAC

## Final deployed URL
https://slidify.live

## Youtube Demo Link


## Team members with @mail.utoronto.ca emails

- Mohamed Besey: mohamed.besey@mail.utoronto.ca
- Amy Li: amym.li@mail.utoronto.ca
- Christine Zhao: christine.zhao@mail.utoronto.ca

## Brief description of the web application

Slidify is a web application that converts videos into a sequence of slides based on the script or spoken content in the video. Users can upload a video file, and the application will automatically extract the audio, transcribe the spoken content into text, and generate slides summarizing the key points of the script. This tool is particularly useful for educators, presenters, and content creators who want to create accompanying slide decks for their videos.

## Bullet points outlining how to fulfill "Required Elements"

- Using Vue 3 for the frontend framework

- Using Express as the core backend API with sqlite as a database to store user and presentation information

- Deployed on a virtual machine using Docker and Docker Compose

- The application must interact with at least one third-party API.

  - Google Slides API
  - Google Custom Search API
  - API to summarize content (using Speechmatics API https://www.speechmatics.com)

- Using OAuth 2.0 for account creation and sign-up

## Bullet points outlining how to fulfill "Additional Requirements"

- A piece of the application is “real-time”, which means it can reflect other
  user changes without refreshing

  - Users can see the slides and progress percentage as they are being generated in "real-time"

- A piece of the application has functionality that executes a long-running task
  (something that could take more than 10 seconds to complete)
  - Processing the video uploads and generating the slides are
    long-running tasks

## Your alpha version, beta version, and final version milestones

- Alpha version:

  - Complete frontend basic layout of the different views using Vue 3.
  - Integrate OAuth 2.0 authentication flow with Google.
  - Implement basic CRUD operations for user profiles and video uploads.
  - Set-up the third-party APIs
  - Set up endpoints for video upload and storing user info.
  - Set up Express server to handle HTTP requests.
  - The app is able to generate basic slides

- Beta version:

  - Video uploading is working
  - Improved user interface design and add user profile management features.
  - Implement functionality to extract audio from uploaded videos using FFmpeg.
  - Implement transcription
  - The app is able to generate slides from the video.
  - Deployed on a public URL
  - Generated slides include an accompanying script for the speaker
  - Generated slides include relevant images to the presentation's topics
  - Testing for most functionalities are done

- Final version:
  - Refine user interface and user experience based on feedback and testing.
  - Slides generation from video upload is fully functional including viewing generated slides, allowing users to preview and download them.
  - Complete slides generation including summarizing the text and formatting it for slide presentation.
  - Use WebSockets to provide real-time updates to the frontend about the processing status.
  - Users can see their slides history
  - Perform thorough testing of all backend functionalities, including transcription accuracy and slide generation
  - Optimize processing tasks for better performance.
  - Ensure the application is fully deployed and stable on a public URL.
  - Set up monitoring tools to track application performance and handle any issues.
