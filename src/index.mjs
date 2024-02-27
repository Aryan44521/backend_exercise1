import express, { request, response } from "express";
const app = express();
const PORT =  3000;

//global containers , variables here
const fruits = [
  { id: 1, name: "Apple", color: "Red", price: 1.99 },
  { id: 2, name: "Banana", color: "Yellow", price: 0.79 },
  { id: 3, name: "Orange", color: "Orange", price: 0.89 },
  { id: 4, name: "Grapes", color: "Purple", price: 2.49 },
  { id: 5, name: "Strawberry", color: "Red", price: 3.99 },
  { id: 6, name: "Watermelon", color: "Green", price: 4.99 },
  { id: 7, name: "Pineapple", color: "Yellow", price: 2.29 },
  { id: 8, name: "Kiwi", color: "Brown", price: 1.49 },
];

//global functions here
function sortByPrice(fruits) {
  // Use the sort method to sort fruits by price in ascending order
  fruits.sort((a, b) => a.price - b.price);
  return fruits;
}

function sortByid(fruits) {
  fruits.sort((a, b) => a.id - b.id);
  return fruits;
}

function logme(request,response,next){
    console.log(`Logging the requests: ${request.method}-${request.url}`);
    console.log(`Logging the response: ${response.method}- ${response.url}`);
    console.log(`Logging the next: ${next.method}- ${next.url}`);
    next();

}

//all middleware here
app.use(express.json());
app.use(logme);

//all get requests here
app.get("/", (request, response) => {
  response.json("hello");
});

app.get("/api/fruits", (request, response) => {
  const filtervalue = request.query.filter;
  console.log(filtervalue);
  if (filtervalue == undefined) {
    response.send(fruits);
  }
  if (filtervalue == "price") {
    //sortby price
    const sortedFruits = sortByPrice(fruits);

    // Output the sorted fruits
    console.log(sortedFruits);
  } else if (filtervalue == "name") {
    //sortby name
    response.send(fruits);
  } else if (filtervalue == "id") {
    //sortby id
    const sortedarray = sortByid(fruits);
    response.send(sortedarray);
  }
});

app.get("/api/test/:field", (request, response) => {
  response.send("hello from test endpoint");
  console.log(request.params);
});

//all post requests here
app.post("/api/users", (request, response) => {
  const newFruit = request.body;
  const id = fruits.length;
  newFruit.id = id;
  console.log(newFruit);
  fruits.push(newFruit);
  return response.send(fruits);
});

// patch requests here
app.patch("/api/users", (request, response) => {
  console.log("patch working");
  const { id, name } = request.body;
  const arrayindex = fruits.findIndex((fruit) => fruit.id === id);
  console.log(arrayindex);
  if (arrayindex == -1) {
    return response.status(404).send("fruit not found");
  } else {
    fruits[arrayindex].name = name;
    return response.send(fruits);
  }
});

app.patch("/api/users/viaqueryparams", (request, response) => {
  //getting the payload parameters
  const { updatedName } = request.body;

  //getting the id from query param

  const updateId = parseInt(request.query.id);
  //console.log(updateId);

  //accessing its array index using the updatedid
  const arrayIndex = fruits.findIndex((x) => x.id === updateId);
  console.log(`array index: ${arrayIndex}`);
  if (arrayIndex == -1) {
    return response.status(404).send("fruit not found");
  } else {
    //use array indexing to pick up the target object and dot operate to update the value of its key
    fruits[arrayIndex].name = updatedName;
    return response.send(fruits);
  }
});

app.delete("/api/users/viaqueryparams", (request, response) => {
  // Getting the id via query params
  const  deleteId  = request.query.id;

  // Finding the index of the fruit object with the specified ID
  const arrayIndex = fruits.findIndex((x) => x.id === parseInt(deleteId));

  if (arrayIndex === -1) {
    return response.status(404).send("Fruit not found");
  } else {
    // Use array indexing to pick up the target object and delete it
    fruits.splice(arrayIndex, 1); // Remove one element at the found index
    return response.send(fruits);
  }
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
