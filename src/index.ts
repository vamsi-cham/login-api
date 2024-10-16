import "reflect-metadata";
import express, { Request, Response } from "express";
import { User } from "./entity/User"; // Adjust the path as necessary
import { AppDataSource } from "./config/dataSource";
import { Poll } from "./entity/Poll";
import { json } from "stream/consumers";


// Initialize the data source and start the Express server
AppDataSource.initialize().then(() => {
    const userRepository = AppDataSource.getRepository(User);
    const pollRepository = AppDataSource.getRepository(Poll);
    const app = express();
    app.use(express.json());

    // POST /poll
    app.post('/poll', async (req: Request, res: Response) => {
        const { question, options, userId } = req.body;
        const newPoll = new Poll();
        newPoll.question = question;
        newPoll.option_one = options[0];
        newPoll.option_two = options[1];
        newPoll.option_three = options[2];
        newPoll.option_four = options[3];
        newPoll.userId = userId;
        await pollRepository.save(newPoll);
        res.status(201).send(newPoll);
    });

    // GET /poll/:pollId
    app.get('/poll/:pollId', async (req: Request, res: Response) => {
        const poll = await pollRepository.findOne({
            where: {
                id: req.params.pollId as any,
            }
        });
        if (poll) {
            res.status(200).send(poll);
        } else {
            res.status(404).send('Poll not found');
        }
    });

    // POST /vote
    app.post('/vote', async (req: Request, res: Response) => {
        const { userId, option, pollId } = req.body;
        const poll: any = await pollRepository.findOne({
            where: {
                id: pollId,
            }
        });
        if (poll) {
            const votedBy = poll.votedBy ? JSON.parse(poll.votedBy) : [];
            if (!votedBy.includes(userId)) {
                votedBy.push(userId);
                poll.votedBy = JSON.stringify(votedBy);
                poll[option] += 1;
                await pollRepository.save(poll);
                res.status(200).send(poll);
            } else {
                res.status(409).send('User has already voted');
            }
        } else {
            res.status(404).send('Poll not found');
        }
    });

    // PUT /poll - Update poll status
    app.put('/poll', async (req: Request, res: Response) => {
        const { pollId, status } = req.body;
        const pollIdNumber: any = parseInt(pollId);

        if (!isNaN(pollIdNumber) && (status === 'Active' || status === 'Inactive')) {
            const poll = await pollRepository.findOne(pollIdNumber);
            if (poll) {
                poll.status = status;
                await pollRepository.save(poll);
                res.status(200).send(`Poll status updated to ${status}`);
            } else {
                res.status(404).send('Poll not found');
            }
        } else {
            res.status(400).send('Invalid input');
        }
    });

    // Registration endpoint
    app.post("/register", async (req: any, res: any) => {
        const { role, username, password } = req.body;
        try {
            if(role === 'Anonymous'){
                const newUser = new User();
                newUser.role = role;
                await userRepository.save(newUser);
                return res.status(201).json({ message: "User registered successfully" });
            }
            // Check if user already exists
            const existingUser = await userRepository.findOneBy({ username });
            if (existingUser) {
                return res.status(409).json({ message: "Username already exists" });
            }

            // Create new user
            const newUser = new User();
            newUser.role = role;
            newUser.username = username;
            newUser.password = password; // Hash the password in a real scenario
            await userRepository.save(newUser);

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error registering user", error });
        }
    });

    // Login endpoint
    app.post("/login", async (req: any, res: any) => {
        const { username, password } = req.body;
        try {
            const user = await userRepository.findOneBy({ username, password });
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            res.json({ message: "Login successful", user: username });
        } catch (error) {
            res.status(500).json({ message: "Error logging in", error });
        }
    });

    // Start the server
    app.listen(3001, () => {
        console.log("Server started on http://localhost:3001");
    });
}).catch(error => {
    console.error("Error during Data Source initialization:", error);
});
