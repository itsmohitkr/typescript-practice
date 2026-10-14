import { createUserRepo } from "./user.repository";
import { createUserService } from "./user.service";
import { createUserController } from "./user.controller";

// 1. Create a single repository instance
const userRepo = createUserRepo();

// 2. Inject the repository into the service
const userService = createUserService(userRepo);

// 3. Inject the service into the controller
const userController = createUserController(userService);

// 4. Export the configured controller
export default userController;
