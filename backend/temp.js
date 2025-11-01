// Admin signup
app.post("/admin-signup", async (req, res) => {
  
});
app.use("/")
// User signup
app.post("/user-signup", async (req, res) => {
  
});

// Admin Login
app.post("/admin-login", async (req, res) => {
  
});

// User Login
app.post("/user-login", async (req, res) => {
  
});

// Admin dashboard mcq section
app.post("/add-question/:eventId", verifyJWTToken, async (req, res) => {
  
});

app.get("/questions/:eventId", verifyJWTToken, async (req, res) => {
  
});

app.get("/question/:id", verifyJWTToken, async (req, res) => {
  
});

app.put("/update-question/:questionId", verifyJWTToken, async (req, res) => {
  
});

app.delete("/delete/:id/:eventId", verifyJWTToken, async (req, res) => {
  
});

// create mcq event
app.post("/create-mcq-event", verifyJWTToken, async (req, res) => {
  
});
// get mcq events
app.get("/events", verifyJWTToken, async (req, res) => {
  
});
// events
app.get("/events/:id", verifyJWTToken, async (req, res) => {
  
});
// update event data
app.put("/update-event/:id", verifyJWTToken, async (req, res) => {
  
});
// delete event
app.delete("/delete-event/:id", verifyJWTToken, async (req, res) => {
  
});

// user routes
app.get("/explore-events", async (req, res) => {
  
});

app.get("/explore-events/:id", verifyJWTToken, async (req, res) => {
  
});


// register for event route
app.post("/register-event/:id", verifyJWTToken, async (req, res) => {
  
});

app.get("/event-registrations/:id", verifyJWTToken, async(req,res)=>{
  
})

app.post("/start-event/:id", verifyJWTToken, async (req, res) => {
  
});
 app.get("/my-registrations", verifyJWTToken, async (req, res) => {
  
});
