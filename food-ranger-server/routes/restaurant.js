const router = require("express").Router();
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const Review = require('../models/Review');
const verify = require('./verifyToken');

// Creates the restaurants and adds into the database
// This route will go to, /restaurants
router.post('/', (req, res) => {

    const restaurant = new Restaurant({
        name: req.body.name,   //gives name that the store had entered
        email: req.body.email,
        menu : req.body.menu,
        area : req.body.area
    });
    restaurant.save()  // adds to the database
    .then(data => {
        res.json({message : data});
    })
    .catch(err => {
        res.json({message : err});
    }).then(res => res.json());

    //console.log(data);
});

//Updates all the provided movie Information
//Algorithm to update,
//First, find the restaurant by the id
//Than use $set to update the field
router.patch('/:id', async(req,res) => {
    try{
        const updatedRestaurant = await Restaurant.updateOne(
            { _id : req.params.id},
            {$set : {name : req.body.name,
                    email : req.body.email,
                    menu : req.body.menu,
                    area : req.body.area
            }}
        );
        res.json({message : updatedRestaurant});
    }catch(err){
        res.json({message : err})
    }
});

// Updates the menu 
// Algorithm to update,
// First, find the restaurant by the id
// Than use $push to add element inside the menu's array
router.patch('/addmenu/:id', async(req,res) => {
    try{
        const updatedRestaurant = await Restaurant.findOneAndUpdate(
            { _id : req.params.id},
            {$push : {
                menu: {
                    name : req.body.name,
                    unit_price : req.body.unit_price
                }
            }}
        );
        res.json({message : updatedRestaurant});
    }catch(err){
        res.json({message : err})
    }
});



// Delete the restaurant
// Get the restaurant id and remove it 
router.delete('/:id', async (req,res) => {
    try{
        const restaurant = await Restaurant.deleteOne({_id : req.params.id });  
        res.json({message : restaurant});

    }catch(err){
        res.json({message : err});
    }
});

// Finds the restaurants with specific id
// This route will go to, /restaurants/:id
// Adding verify, which will make the private routes
// Use below line, to add the middleware, that is verify
// router.get('/:id',verify, async (req,res) => {
 router.get('/:id', async (req,res) => {
    try{
        const restaurant = await Restaurant.findById(req.params.id);  
        res.json({message : restaurant});
    }catch(err){
        res.json({message : err})
    }
});

//** Orders **//

//Place an order to the specific restaurant
router.post('/:id/orders', async(req,res) => {
    try{
        const order = new Order({
            restaurant_id : req.params.id,
            user_id : req.body.user_id,
            items: req.body.items,
            subtotal : req.body.subtotal
        });

        const savedOrder = await order.save();  //adds to the databse. Using await to wait
        res.json({message : savedOrder});

    }catch(err){
        res.json({message : err})
    }
});

// get the orders of one restaurant
// It gets all the orders from the restaurants
router.get('/:id/orders', async(req,res)=>{
    try{
        const orders = await Order
            .find({"restaurant_id" : req.params.id})
            .populate("user_id")
            .populate("restaurant_id");
            //.populate will give us the information about the restaurant and user
            // .populate will convert the restaurant_id or user_id field to it's exact content
            // Inside the .populate just pass the filed that we want  
        res.json({message : orders});

    }catch(err){
        res.json({message : err});
    }

});

// List orders placed by a specific user on a restaurant
// Specific restaurant and specific user
router.get('/:id/orders/:userId', async(req,res)=>{
    try{
        const orders = await Order
            .find({"restaurant_id" : req.params.id , "user_id": req.params.userId})
            .populate("user_id")
            .populate("restaurant_id");

        res.json({message : orders});

    }catch(err){
        res.json({message : err});
    }
});

//** Reviews **//
// Post restaurant review
router.post('/:id/reviews', async (req,res) => {
    try{

        const already_exists_user = await Review.findOne({"user_id" : req.body.user_id});

        if (already_exists_user != null ){
            res.json({ "message" : "The user has already voted" });
            return;
        }

        const review = new Review({
            user_id : req.body.user_id,
            restaurant_id : req.params.id,
            content : req.body.content,
            rating : req.body.rating
        });

        const savedReview = await review.save();  //adds to the databse. Using await to wait
        res.json({message : savedReview});

    }catch(err){
        res.json({message : err})
    }
});

//List restaurant review
router.get('/:id/reviews', async(req,res)=>{
    try{
        const reviews = await Review
            .find({"restaurant_id" : req.params.id })
            .populate("user_id")
            .populate("restaurant_id");

        res.json({message : reviews});

    }catch(err){
        res.json({messsage : err});
    }
});

//Delete restaurant review
router.delete('/:id/reviews/:reviewId', async(req,res) => {
    try{
        const review = await Review.remove({"_id" : req.params.reviewId});
        res.json({message : reviews});
    }catch(err){
        res.json({message: err});
    }
});

module.exports = router;
