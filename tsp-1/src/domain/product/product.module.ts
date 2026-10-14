import { createProductRepo } from "./product.repository";
import { createProductService } from "./product.service";
import { createProductController } from "./product.controller";

// 1. Create a single repository instance
const productRepo = createProductRepo();

// 2. Inject the repository into the service
const productService = createProductService(productRepo);

// 3. Inject the service into the controller
const productController = createProductController(productService);

// 4. Export the configured controller
export default productController;
