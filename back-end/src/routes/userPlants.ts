import { Router, Request, Response } from "express";
import { Plant } from "../entity/Plant";
import { UserPlant } from "../entity/UserPlant";
import { User } from "../entity/User";

const router = Router();

router.post("/", async (request: Request, response: Response) => {
  const userPlant = new UserPlant();
  const user = await User.findOne({ where: { id: request.body.user } });
  const plant = await Plant.findOne({ where: { id: request.body.plant } });

  if (!user) {
    response.status(400).send("Wrong user parameter");
    return;
  }
  if (!plant) {
    response.status(400).send("Wrong plant parameter");
    return;
  }

  userPlant.user = user;
  userPlant.plant = plant;
  userPlant.name = request.body.name || plant.name;
  userPlant.water = request.body.water || plant.water;
  await userPlant.save();

  response.status(201).json(userPlant);
});

router.get("/", async (request: Request, response: Response) => {
  const userPlants = await UserPlant.find({ order: { created: "DESC" } });

  response.status(200).json(userPlants);
});

router.get("/:id", async (request: Request, response: Response) => {
  const userPlant = await UserPlant.findOne({
    where: { id: request.params.id },
    order: { created: "DESC" },
  });

  if (!userPlant) {
    response.sendStatus(404);
    return;
  }

  response.status(200).json(userPlant);
});

export default router;
