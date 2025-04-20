import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// app.get("/",function(req,res){
//     res.send("Holaaaa");
// });

app.use(express.static("public"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
