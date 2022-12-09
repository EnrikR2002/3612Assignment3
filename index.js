const path = require('path');
const fs = require('fs');
const express = require('express');
const api = express();

const artistJsonPath = path.join(__dirname, "", "artists.json");
const galleryJsonPath = path.join(__dirname, "", "galleries.json");
const paintingsJsonPath = path.join(__dirname, "", "paintings-nested.json");

const galleryJsonData = fs.readFileSync(galleryJsonPath);
const artistJsonData = fs.readFileSync(artistJsonPath);
const paintingsJsonData = fs.readFileSync(paintingsJsonPath);

const artists = JSON.parse(artistJsonData);
const galleries = JSON.parse(galleryJsonData);
const paintings = JSON.parse(paintingsJsonData);


// Returns JSON for all artists
api.get('/artist', (req, res) => {
    res.send(artists);
    console.log("artists.json file returned");   
    });

// Returns JSON for all artists from a specified country
api.get('/artist/:country', (req, res) => {
    const country = req.params.country;
    const artistsByCountry = artists.filter(artist => artist.Nationality.toLowerCase() === country.toLowerCase());
    if (artistsByCountry.length === 0) 
    {
        res.status(404).json("No artists found in that country.");
    }
    else
    {
        res.send(artistsByCountry);
    }   
    console.log("artists country returned.");
});

// Returns JSON for all galleries 
api.get('/gallery', (req, res) => {
    res.send(galleries);
    console.log("galleries.json file returned.");
});

// Returns JSON for all galleries from the specified country.
api.get('/gallery/:country', (req, res) => {
    const country = req.params.country;
    const galleriesByCountry = galleries.filter(gallery => gallery.GalleryCountry.toLowerCase() === country.toLowerCase());
    if (galleriesByCountry.length === 0)
    {
        res.status(404).json("No galleries found in that country.");
    }
    else
    {
        res.send(galleriesByCountry);
    }
    console.log("Galleries country returned.");
});

// Returns JSON for all paintings
api.get('/painting', (req, res) => {
    res.send(paintings);
    console.log("paintings.json file returned.");
});

// Returns JSON for the paintings whose gallery id matches the provided gallery id.
api.get('/painting/gallery/:id', (req, res) => {
    const temp = req.params.id;
    const id = parseInt(temp);
    const paintingsByGalleryId = paintings.filter(painting => painting.gallery.galleryID === id);
    
    if(paintingsByGalleryId.length === 0)
    {
        res.status(404).json("No paintings found in that gallery.");
    }
    else
    {
        res.send(paintingsByGalleryId);
    }
    console.log("Paintings gallery id returned.");
});

// Returns JSON for the paintings whose artist id matches the provided artist id.
api.get('/painting/artist/:id', (req, res) => {
    const temp = req.params.id;
    const id = parseInt(temp);
    const paintingsByArtistId = paintings.filter(painting => painting.artist.artistID === id);

    if(paintingsByArtistId.length === 0)
    {
        res.status(404).json("No paintings found by that artist.");
    }
    else
    {
        res.send(paintingsByArtistId);
    }
    console.log("Paintings artist id returned.");
});

// Returns all paintings whose yearOfWork field is between the two supplied values.
api.get('/painting/year/:min/:max', (req, res) => {
    const temp1 = req.params.min;
    const temp2 = req.params.max;
    const min = parseInt(temp1);
    const max = parseInt(temp2);

    const paintingsByYear = paintings.filter(painting => painting.yearOfWork >= min && painting.yearOfWork <= max);
     
    if(paintingsByYear.length === 0)
    {
        res.status(404).json("No paintings found in that year range.");
    }
    else
    {
        res.send(paintingsByYear);
    }
    console.log("Paintings year returned.");
});

// Returns JSON for the paintings whose title contains the provided text.
api.get('/painting/title/:text', (req, res) => {
    const text = req.params.text;
    const paintingsByTitle = paintings.filter(painting => painting.title.toLowerCase().includes(text.toLowerCase()));

    if(paintingsByTitle.length === 0)
    {
        res.status(404).json("No paintings found with that title.")
    }
    else
    {
        res.send(paintingsByTitle);
    }
    console.log("Paintings title returned.");
});

// Returns JSON for the paintings that have a color that matches the provided hex value. 
api.get('/painting/color/:name', (req, res) => {
    const name = req.params.name;
    const paintingsByColor = paintings.filter(painting => painting.details.annotation.dominantColors.some(color => color.name.toLowerCase() === name.toLowerCase()));
   
    if(paintingsByColor.length === 0)
    {
        res.status(404).json("No paintings found with that color.");
    }
    else
    {
        res.send(paintingsByColor);
    }
    console.log("Paintings color returned.");
});

api.listen(3000, () => console.log('Example api listening on port 3000!'));