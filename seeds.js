const mongoose = require('mongoose'),
Campsite      = require('./models/campsites'),
Comment        = require('./models/comments');

var data = [
  {
      name: "Cloud's Rest", 
      image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      author: {
        id: "5d9769b4716a8b210862cb0a",
        username: "Bob"
      }
  },
  {
      name: "Desert Mesa", 
      image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      author: {
        id: "5d9769b4716a8b210862cb0a",
        username: "Bob"
      }
  },
  {
      name: "Canyon Floor", 
      image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      author: {
        id: "5d9769b4716a8b210862cb0a",
        username: "Bob"
      }
  },
  {
    name: "Cypress Valley",
    image: "https://res.cloudinary.com/sagacity/image/upload/c_crop,h_3595,w_5393,x_0,y_0/c_limit,dpr_auto,f_auto,fl_lossy,q_80,w_1080/camping-tent_fqmzoy.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    author: {
      id: "5d9769b4716a8b210862cb0a",
      username: "Bob"
    }
  }
]

function seedDB() {
  Campsite.deleteMany({}, (err) => {
    if(err)
      console.error(err);
    console.log('Removed campsites');
    Comment.deleteMany({}, (err) => {
      if(err)
        console.error(err);
      console.log('removed comments!');
      data.forEach((seed) => {
        Campsite.create(seed, (err, camp) => {
          if(err)
            console.error(err);
          else {
            console.log('Added new Campsite');
            Comment.create(
              {
                text: 'Beutiful campsites will all ammenities.',
                author: {
                  id: "5d9769b4716a8b210862cb0a",
                  username: "Bob" 
                } 
              }, (err, comment) => {
                if(err)
                  console.error(err);
                else {
                  camp.comments.push(comment);
                  camp.save();
                  console.log('Created new comment');
                }
              });
          }
        });
      });
    });
  });
}
module.exports = seedDB;