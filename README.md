# The Kara-OK-Corral

## Motivation

You’re ready to perform your next karaoke hit and win your next karaoke battle. But with so many sing-worthy songs, sifting through options can feel like the wild-wild-west. 

Introducing **The Kara-OK-Corral**. This app enables you build personal and shared song karaoke lists, link to karaoke videos, throw a karaoke party, and react to friends' previously recorded performances. Now you and your posse can bring a full song arsenal to your next karaoke showdown. The Kara-OK-Corral is home to your karaoke roundup.

## Features

The Kara-OK-Corral gives you all the info and features you need to tend to your collection of sing-worthy songs and organize your next karaoke party, including: 
+ Track a collection of your personal karaoke performance favs
+ Keep a karaoke playlist private to you or share it publicly
+ Turn a playlist into a party by adding friends to the list, where all party goers can enter songs for the karaoke party song queue
+ Click on a video in the queue and have the embedded video show up in The-Kara-OK app so you can start singing when it's your turn, all within the app experience
+ Link a previously recorded performance to a song, and make the performance private, visible to friends, or public
+ Be able to comment on your friends’ shared performances

## Technology Used

We built this application using the MERN Stack - **M**ongoDB/Mongoose, **E**xpress, **R**eact, **N**ode. Additional technologies used in the deployed application include:

+ [Apollo Client/Server](https://www.apollographql.com/)
+ [GraphQL](https://graphql.org/)
+ HTML5 & CSS3
+ [React Bootstrap](https://react-bootstrap.github.io/)
+ [Ityped](https://www.npmjs.com/package/ityped)
+ [Heroku](https://www.heroku.com/home)
+ Git/GitHub

## Deployed App

https://the-kara-ok-corral.herokuapp.com/

## About the Developers

The Kara-OK-Corral was brought to you by these full-stack developers (the eMCeeS, get it? :) ), as part of the UC Berkeley Extension Full Stack Coding Bootcamp:
+ [Michael](https://github.com/costanza13)
+ [Michelle](https://github.com/cupcakesprinkle3)
+ [Cecilia](https://github.com/crossigarcia)
+ [Chitra](https://github.com/ciyer87)
+ [Sushma](https://github.com/renusushmak)

The team followed this development approach:
+ A working Google Doc with the project's user story, acceptance criteria, MVP feature list, future feature list, and GitHub workflow
+ GitHub workflow used the develop branch for 99% of the commits during the project, main was only used for production-ready code. To see the code and commits as the app was being built, view the develop branch.
+ Daily standups
+ Always-on Discord room for ongoing chat
+ Impromptu meetings on Discord or Zoom for pair programming, debugging, and collaboration
+ GitHub projects for a kanban board and issues

## Screenshots & Tutorial

### Homepage

The home page is where it all starts, with an inviting look and inspiring messaging, the main goal of the home page is to inspire users to sign up, and on subsequent visits, to log in.

![The Kara-OK-Corral Homepage](https://user-images.githubusercontent.com/79061264/131225660-b07469c8-fc84-4d5e-bc1b-0711204fdbe6.png)

### Login/Signup

Included prominently at the top in the navbar, the main action for users to take on the home page is to join the corral.

![The Kara-OK-Corral Login Signup](https://user-images.githubusercontent.com/79061264/131225793-4e9793f2-7d04-44ee-b3f8-dfd34a5321ad.png)

### Your Dashboard

Once you log in, you're taken to your dashboard. Here you can click the friends link on the right to get to a friends list modal where you can search for friends, and add or remove friends. Also from your dashboard you can create personal (private or public) or party (shared with invited friends) playlists, for solo singalongs or a group showdown with your posse. You can edit and delete playlists. You can add/edit/delete songs to parties you've been invited to. You can click a list (personal or party) to go to page dedicated to that list. The dashboard is the center of all of your user activity.

![The Kara-OK-Corral User Dashboard](https://user-images.githubusercontent.com/79061264/131225784-51d9c811-c8e8-40d3-b775-e0841eb5008a.png)

### Your Friends List

From your dashboard, you click your friends list link to the right hand side of the page and a friends list modal is revealed, where you can search for and add users, remove users you previously added, and see your total friend count and list of friends.

![The Kara-OK-Corral Friends Modal](https://user-images.githubusercontent.com/79061264/131225837-f9c508d5-a56f-4614-93e6-a142f1b50839.png)

### A User's Public Profile

Clicking on a friend in your list takes you to that person's public profile. You can see information that the user has made public: the count of friends is automatically public per user, whereas public playlists are playlists specifically set as public by the user, the song count in public playlists counts up all songs in playlists made public by the user, and public performances counts up the performance videos attached by the user to a song and then made public by the user.

![The Kara-OK-Corral Public User Profile](https://user-images.githubusercontent.com/79061264/131225891-da18f97f-87d1-4eeb-86d7-839f458c480f.png)

### A Party Playlist Page

A party playlist is the ultimate home for a karaoke party roundup. When a user creates a playlist on the dashboard and shares it with friends, it automatically becomes a karaoke party for the entire posse. Members can add songs, and when the official karaoke showdown begins, simply click the video URL of each song in the queue and let the performances begin! Clicking on the karaoke video link displays the embedded video under the playlist, letting the singer sing along as the song is played. When the performance is done, click the next video in the playlist to continue with the karaoke showdown. The Kara-OK-Corral in-app embedded video experience means you can use the app for in-person or virtual karaoke parties.

![The Kara-OK-Corral Party Playlist](https://user-images.githubusercontent.com/79061264/131226340-a74e4183-369a-421a-b96b-45be323881d5.png)

### A Public Performance with Reactions

When users log a performance with a song, and then click the performance link in playlist, the user is taken to a page to optionally make the performance a public one. When a performance is marked public, anyone can visit the public performance page while logged in and leave comments. Keep it classy and post positive comments only ... karaoke takes courage, which is commendable no matter what, and it's meant to be fun! Good vibes only here at The Kara-OK Corral.    

![The Kara-OK-Corral Public Performance](https://user-images.githubusercontent.com/79061264/131226685-9e975866-b1ee-4cd2-a153-15aabe48895d.png)
