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

// if a request is made for artist, return the artists.json file 
api.get('/artists', (req, resp) => {
    // return all artist names in the artists.json file
    resp.send(artists);
    console.log("artists.json file returned.");    
    });

// Returns JSON for all artists from the specified country.
api.get('/artists/:country', (req, resp) => {
    const country = req.params.country;
    const artistsByCountry = artists.filter(artist => artist.Nationality.toLowerCase() === country.toLowerCase());
    if (artistsByCountry.length === 0) 
    {
        resp.status(404).json("No artists found in that country.");
    }
    else
    {
        resp.send(artistsByCountry);
    }  
    console.log("artists country returned.");
});

// Returns JSON for all galleries 
api.get('/galleries', (req, res) => {
    res.send(galleries);
    console.log("galleries.json file returned.");
});

// Returns JSON for all galleries from the specified country.
api.get('/galleries/:country', (req, resp) => {
    const country = req.params.country;
    const galleriesByCountry = galleries.filter(gallery => gallery.GalleryCountry.toLowerCase() === country.toLowerCase());
    if (galleriesByCountry.length === 0)
    {
        resp.status(404).json("No galleries found in that country.");
    }
    else
    {
        resp.send(galleriesByCountry);
    }
    console.log("galleries country returned.");
});

// Returns JSON for all paintings
api.get('/paintings', (req, resp) => {
    resp.send(paintings);
    console.log("paintings.json file returned.");
});

// Returns JSON for the painting whose id matches the provided id.
api.get('/painting/:id', (req, resp) => {
    const temp = req.params.id;
    const id = parseInt(temp);
    const painting = paintings.filter(painting => painting.paintingID === id);
    if (painting.length === 0)
    {
        resp.status(404).json("No painting found with that id.");
    }
    else
    {
        resp.send(painting);
    }
    console.log("paintings id file returned.");
});

// Returns JSON for the paintings whose gallery id matches the provided gallery id.
api.get('/painting/gallery/:id', (req, resp) => {
    const temp = req.params.id;
    const id = parseInt(temp);
    const paintingsByGalleryId = paintings.filter(painting => painting.gallery.galleryID === id);
    
    if(paintingsByGalleryId.length === 0)
    {
        resp.status(404).json("No paintings found in that gallery.");
    }
    else
    {
        resp.send(paintingsByGalleryId);
    }
    console.log("paintings gallery id returned.");
});

// Returns JSON for the paintings whose artist id matches the provided artist id.
api.get('/painting/artist/:id', (req, resp) => {
    const temp = req.params.id;
    const id = parseInt(temp);
    const paintingsByArtistId = paintings.filter(painting => painting.artist.artistID === id);

    if(paintingsByArtistId.length === 0)
    {
        resp.status(404).json("No paintings found by that artist.");
    }
    else
    {
        resp.send(paintingsByArtistId);
    }
    console.log("paintings artist id returned.");
});

// Returns all paintings whose yearOfWork field is between the two supplied values.
api.get('/painting/year/:min/:max', (req, resp) => {
    const temp1 = req.params.min;
    const temp2 = req.params.max;
    const min = parseInt(temp1);
    const max = parseInt(temp2);

    const paintingsByYear = paintings.filter(painting => painting.yearOfWork >= min && painting.yearOfWork <= max);
     
    if(paintingsByYear.length === 0)
    {
        resp.status(404).json("No paintings found in that year range.");
    }
    else
    {
        resp.send(paintingsByYear);
    }
    console.log("paintings year returned.");
});

// Returns JSON for the paintings whose title contains (somewhere) the provided text. 
api.get('/painting/title/:text', (req, resp) => {
    const text = req.params.text;
    const paintingsByTitle = paintings.filter(painting => painting.title.toLowerCase().includes(text.toLowerCase()));

    if(paintingsByTitle.length === 0)
    {
        resp.status(404).json("No paintings found with that title.")
    }
    else
    {
        resp.send(paintingsByTitle);
    }
    console.log("paintings title returned.");
});

// Returns JSON for the paintings that have a color that matches the provided hex value.
api.get('/painting/color/:name', (req, resp) => {
    const name = req.params.name;
    const paintingsByColor = paintings.filter(painting => painting.details.annotation.dominantColors.some(color => color.name.toLowerCase() === name.toLowerCase()));
   
    if(paintingsByColor.length === 0)
    {
        resp.status(404).json("No paintings found with that color.");
    }
    else
    {
        resp.send(paintingsByColor);
    }
    console.log("paintings color returned.");
});

api.listen(process.env.PORT || 4000, ()=>console.log("Server on " + process.env.port))