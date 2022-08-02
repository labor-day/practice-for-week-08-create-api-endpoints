const http = require('http');

const dogs = [
  {
    dogId: 1,
    name: "Fluffy",
    age: 2
  }
];

let nextDogId = 2;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // assemble the request body
  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  req.on("end", () => { // request is finished assembly the entire request body
    // Parsing the body of the request depending on the Content-Type header
    if (reqBody) {
      switch (req.headers['content-type']) {
        case "application/json":
          req.body = JSON.parse(reqBody);
          break;
        case "application/x-www-form-urlencoded":
          req.body = reqBody
            .split("&")
            .map((keyValuePair) => keyValuePair.split("="))
            .map(([key, value]) => [key, value.replace(/\+/g, " ")])
            .map(([key, value]) => [key, decodeURIComponent(value)])
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});
          break;
        default:
          break;
      }
      console.log(req.body);
    }

    /* ======================== ROUTE HANDLERS ======================== */

    // GET /dogs
    if (req.method === 'GET' && req.url === '/dogs') {
      // Your code here
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(dogs));

      /*
      fetch("/dogs")
        .then(res => res.json())
        .then(resBody => console.log(resBody))
      */
    }

    // GET /dogs/:dogId
    if (req.method === 'GET' && req.url.startsWith('/dogs/')) {
      const urlParts = req.url.split('/'); // ['', 'dogs', '1']
      if (urlParts.length === 3) {
        const dogId = urlParts[2];
        // Your code here

        let requestedDog = dogs.find(dog => dog.dogId == dogId);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(requestedDog));
      }

      /*
      fetch("/dogs/1")
        .then(res => res.json())
        .then(resBody => console.log(resBody))
      */
    }

    // POST /dogs
    if (req.method === 'POST' && req.url === '/dogs') {
      const { name, age } = req.body;
      // Your code here
      let newId = getNewDogId();
      let newDog = {
        dogId: newId,
        name: name,
        age: age
      }
      dogs.push(newDog);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(newDog));

      /*
      fetch(url, [options])
      fetch("/dogs", {
        method: "POST",
          body: new URLSearchParams({
            name: "Seso",
            age:  "10"
          }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => res.json())
      .then(resBody => console.log(resBody))
      */

    }

    // PUT or PATCH /dogs/:dogId
    if ((req.method === 'PUT' || req.method === 'PATCH')  && req.url.startsWith('/dogs/')) {
      const urlParts = req.url.split('/');
      if (urlParts.length === 3) {
        const dogId = urlParts[2];
        // Your code here
        let requestedDog = dogs.find(dog => dog.dogId == dogId);
        let { name, age } = req.body;
        requestedDog.name = name;
        requestedDog.age = age;

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(requestedDog));

      /*
      fetch(url, [options])
      fetch("/dogs/1", {
        method: "PUT",
          body: new URLSearchParams({
            name: "NEW",
            age:  "99"
          }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => res.json())
      .then(resBody => console.log(resBody))
      */
      }
    }

    // DELETE /dogs/:dogId
    if (req.method === 'DELETE' && req.url.startsWith('/dogs/')) {
      const urlParts = req.url.split('/');
      if (urlParts.length === 3) {
        const dogId = urlParts[2];
        // Your code here

        let requestedDogIndex = dogs.findIndex(dog => dog.dogId == dogId);
        dogs.splice(requestedDogIndex, 1);
        console.log(dogs);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify("Successfully deleted"));

        /*
      fetch("/dogs/1", {method: "DELETE"})
      .then(res => res.json())
      .then(resBody => console.log(resBody))
        */
      }
    }

    // No matching endpoint
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    return res.end('Endpoint not found');
  });

});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
