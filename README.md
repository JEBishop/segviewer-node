# SegViewer

**Strava** is an American internet service for tracking human exercise which incorporates social network features. It is mostly used for cycling and running using GPS data. [Wikipedia](https://en.wikipedia.org/wiki/Strava)

**Segments** are one of Strava's coolest features. They are portions of road or trail created by members where athletes can compare times. [Strava](https://support.strava.com/hc/en-us/articles/216918167-Strava-Segments)

I personally like to plan bike rides to hit many of these segments in one ride, Strava doesn't offer an interface to view all or any of a user's saved segments on the map - only a view with the segment name/distance/elevation is available.

https://segviewer.com requires a user to login via oauth2 to their Strava account, before using the Strava API to fetch all of the user's saved segments and display them on a map.

This is done entirely client-side. Not the most secure for sharing API secrets, but 0 maintenance and hosted with GitHub Pages.

Example:
![Example web view](https://user-images.githubusercontent.com/6465753/141688013-250ee219-3d67-4062-bc74-aa3c5bef7647.png)
